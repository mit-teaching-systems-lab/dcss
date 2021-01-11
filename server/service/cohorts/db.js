const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');
// const rolesDb = require('../roles/db');
const scenarioDb = require('../scenarios/db');

async function getCohortScenariosIdList(id) {
  const result = await query(sql`
    SELECT scenario_id as id
    FROM cohort_scenario
    INNER JOIN scenario
       ON cohort_scenario.scenario_id = scenario.id
    WHERE cohort_scenario.cohort_id = ${id}
      AND scenario.deleted_at IS NULL
    ORDER BY cohort_scenario.id;
  `);
  return result.rows.map(row => row.id);
}

async function getCohortScenarios(id) {
  const scenarioIds = await getCohortScenariosIdList(id);
  const scenarios = [];
  for (let scenarioId of scenarioIds) {
    scenarios.push(await scenarioDb.getScenario(scenarioId));
  }
  return scenarios;
}

async function getCohortRuns(id) {
  const result = await query(sql`
    SELECT *
    FROM run
    INNER JOIN cohort_run
       ON run.id = cohort_run.run_id
    WHERE cohort_run.cohort_id = ${id};
  `);

  return result.rows;
}

async function getCohortUsers(cohort_id) {
  // const result = await client.query(sql`
  //   SELECT *
  //   FROM users
  //   INNER JOIN cohort_user_role
  //       ON users.id = cohort_user_role.user_id
  //   WHERE cohort_user_role.cohort_id = ${cohort_id};
  // `);
  // const result = await client.query(sql`
  //   SELECT users.id, users.username, users.email, roles
  //   FROM users, LATERAL (  -- this is an implicit CROSS JOIN
  //     SELECT ARRAY (
  //       SELECT role
  //       FROM cohort_user_role cur
  //       WHERE cur.cohort_id = 10 AND cur.user_id = users.id
  //      ) AS roles
  //   ) lat
  //   WHERE array_length(lat.roles, 1) > 0;
  // `);
  const result = await query(sql`
    SELECT
      id,
      email,
      username,
      personalname,
      roles,
      email = '' OR email IS NULL OR hash IS NULL AS is_anonymous,
      '{owner}' && roles AS is_owner
    FROM users
    INNER JOIN (
      SELECT cohort_id, user_id, ARRAY_AGG(role) AS roles
      FROM (SELECT * FROM cohort_user_role ORDER BY created_at) cur1
      WHERE cohort_id = ${cohort_id} AND ended_at IS NULL
      GROUP BY cohort_id, user_id
    ) cur
    ON users.id = cur.user_id;
  `);
  const users = result.rows;
  const usersById = users.reduce((accum, user) => {
    accum[user.id] = user;
    return accum;
  }, {});

  return {
    users,
    usersById
  };
}

async function createCohort(name, user_id) {
  if (!(name && user_id)) {
    throw new Error(
      'Creating cohort requires user id and a name to be provided'
    );
  }

  return await withClientTransaction(async client => {
    // create a cohort
    const create = await client.query(sql`
      INSERT INTO cohort (name) VALUES (${name}) RETURNING *
    `);
    const cohort = create.rows[0];
    // assign user as owner
    await client.query(sql`
      INSERT INTO cohort_user_role (cohort_id, user_id, role)
      VALUES (${cohort.id}, ${user_id}, 'owner'),
      (${cohort.id}, ${user_id}, 'facilitator')
    `);
    return cohort;
  });
}

async function __getAggregatedCohort(cohort) {
  const runs = await getCohortRuns(cohort.id);
  const scenarios = await getCohortScenariosIdList(cohort.id);
  const cohortUsers = await getCohortUsers(cohort.id);
  return {
    ...cohort,
    ...cohortUsers,
    runs,
    scenarios
  };
}

async function getCohort(id) {
  const result = await query(sql`
    SELECT
      cohort.id,
      cohort.name,
      cohort.created_at,
      cohort.updated_at,
      cohort.deleted_at,
      cur.roles
    FROM cohort
    INNER JOIN (
      SELECT DISTINCT ON (cohort_id) cohort_id, user_id, ARRAY_AGG(role) AS roles
      FROM (SELECT * FROM cohort_user_role ORDER BY created_at) cur1
      WHERE cohort_id = ${id}
      GROUP BY cohort_id, user_id
    ) cur
    ON cohort.id = cur.cohort_id;
  `);
  return result.rowCount ? __getAggregatedCohort(result.rows[0]) : {};
}
//
//
//
// PREVIOUSLY:
//
// async function getMyCohorts(user_id) {
//   const result = await query(sql`
//     SELECT
//       cohort.id,
//       cohort.name,
//       cohort.created_at,
//       cohort.updated_at,
//       cohort.deleted_at,
//       cur.roles
//     FROM cohort
//     INNER JOIN (
//       SELECT cohort_id, user_id, ARRAY_AGG(role) AS roles
//       FROM (SELECT * FROM cohort_user_role ORDER BY created_at) cur1
//       GROUP BY cohort_id, user_id
//     ) cur
//     ON cohort.id = cur.cohort_id
//     WHERE cur.user_id = ${user_id}
//     AND cohort.deleted_at IS NULL
//     ORDER BY cohort.created_at DESC;
//   `);

//   const cohorts = [];
//   for (const row of result.rows) {
//     cohorts.push(await __getAggregatedCohort(row));
//   }
//   return cohorts;
// };
//
//
// async function getAllCohorts() {
//   const result = await query(sql`
//     SELECT *
//     FROM cohort
//     ORDER BY created_at DESC
//   `);
//
//   const cohorts = [];
//   for (const row of result.rows) {
//     cohorts.push(await __getAggregatedCohort(row));
//   }
//   return cohorts;
// };
//
//
//
//
//

async function __getCohorts(user, direction = 'DESC', offset, limit) {
  const orderDirection = direction.toUpperCase();
  let composedQuery;

  // These queries intentionally does not use the sql`` because that
  // tag will attempt to put quotes around the output of
  // ${direction.toUpperCase()}

  if (user.is_super) {
    // Super users will always see all cohorts, even ones
    // marked as deleted.
    composedQuery = `
      SELECT *
      FROM cohort
      ORDER BY created_at ${orderDirection}
    `;
  } else {
    // All other users will only see cohorts for which they
    // have some role in, ie. owner, facilitator, researcher or participant
    composedQuery = `
      SELECT
        cohort.*,
        cur.roles
      FROM cohort
      INNER JOIN (
        SELECT cohort_id, user_id, ARRAY_AGG(role) AS roles
        FROM (SELECT * FROM cohort_user_role ORDER BY created_at) cur1
        GROUP BY cohort_id, user_id
      ) cur
      ON cohort.id = cur.cohort_id
      WHERE cur.user_id = ${user.id}
      AND cohort.deleted_at IS NULL
      ORDER BY cohort.created_at ${orderDirection}
    `;
  }

  if (limit) {
    composedQuery += `
      OFFSET ${offset}
      LIMIT ${limit}
    `;
  }

  const result = await query(composedQuery);
  return result.rows;
}

async function getCohorts(user) {
  const records = await __getCohorts(user);
  const cohorts = [];
  for (const record of records) {
    cohorts.push(await __getAggregatedCohort(record));
  }
  return cohorts;
}

async function getCohortsSlice(user, direction, offset, limit) {
  const records = await __getCohorts(user, direction, offset, limit);
  const cohorts = [];
  for (const record of records) {
    cohorts.push(await __getAggregatedCohort(record));
  }
  return cohorts;
}

async function getCohortsCount(user) {
  const records = await __getCohorts(user);
  return records.length;
}

async function setCohort(id, updates) {
  return await withClientTransaction(async client => {
    const result = await client.query(updateQuery('cohort', { id }, updates));
    return result.rows[0];
  });
}

async function softDeleteCohort(id) {
  return await withClientTransaction(async client => {
    const result = await query(sql`
      UPDATE cohort
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `);
    return result.rows[0];
  });
}

async function setCohortScenarios(id, scenarioIds) {
  return await withClientTransaction(async client => {
    await client.query(sql`
      DELETE FROM cohort_scenario
      WHERE cohort_id = ${Number(id)};
    `);

    // TODO: migrate this into SQL as
    //
    // INSERT INTO cohort_scenario (cohort_id, scenario_id)
    //   SELECT ${id} as cohort_id, t.scenario_id
    //   FROM jsonb_array_elements_text(${scenarioIds}) AS t (scenario_id)
    // ON CONFLICT DO NOTHING;

    for (const scenario_id of scenarioIds) {
      await client.query(sql`
        INSERT INTO cohort_scenario (cohort_id, scenario_id)
        VALUES (${Number(id)}, ${Number(scenario_id)});
      `);
    }

    return scenarioIds;
  });
}

async function getCohortRunResponses({ id, participant_id, scenario_id }) {
  // let responses = [];

  let andClause = participant_id
    ? `run.user_id = ${participant_id}`
    : `run.scenario_id = ${scenario_id}`;

  let select = `
    SELECT
      run.user_id as user_id,
      username,
      run.id as run_id,
      run.scenario_id as scenario_id,
      run.referrer_params as referrer_params,
      response_id,
      run_response.response->>'value' as value,
      run_response.response->>'content' as content,
      audio_transcripts.transcript as transcript,
      CASE run_response.response->>'isSkip'
        WHEN 'false'
          THEN FALSE
          ELSE TRUE
      END as is_skip,
      run_response.response->>'type' as type,
      run_response.created_at as created_at,
      run_response.ended_at as ended_at,
      run.consent_granted_by_user,
      cohort_run.cohort_id
    FROM run_response
    JOIN cohort_run ON run_response.run_id = cohort_run.run_id
    JOIN run ON run.id = cohort_run.run_id
    JOIN users ON users.id = run.user_id
    LEFT JOIN audio_transcripts ON audio_transcripts.key = run_response.response->>'value'
    WHERE cohort_run.cohort_id = ${id}
    AND ${andClause}
    ORDER BY cohort_run.run_id DESC
  `;

  let result = await query(select);

  // if (participant_id) {
  //   const result = await client.query(sql`
  //     SELECT
  //         run.user_id as user_id,
  //         username,
  //         scenario.id as scenario_id,
  //         scenario.title as scenario_title,
  //         cohort_run.run_id as run_id,
  //         response_id,
  //         run_response.response,
  //         run_response.response->>'value' as value,
  //         audio_transcripts.transcript as transcript,
  //         CASE run_response.response->>'isSkip' WHEN 'false' THEN FALSE
  //             ELSE TRUE
  //         END as is_skip,
  //         run_response.response->>'type' as type,
  //         run_response.created_at as created_at,
  //         run_response.ended_at as ended_at
  //     FROM run_response
  //     JOIN cohort_run ON run_response.run_id = cohort_run.run_id
  //     JOIN run ON run.id = cohort_run.run_id
  //     JOIN users ON users.id = run.user_id
  //     JOIN scenario ON scenario.id = run.scenario_id
  //     LEFT JOIN audio_transcripts ON audio_transcripts.key = run_response.response->>'value'
  //     WHERE cohort_run.cohort_id = ${id}
  //     AND run.user_id = ${participant_id}
  //     ORDER BY cohort_run.run_id DESC
  // `);

  //   responses.push(...result.rows);
  // } else {
  //   const result = await client.query(sql`
  //     SELECT
  //         run.user_id as user_id,
  //         username,
  //         scenario.id as scenario_id,
  //         scenario.title as scenario_title,
  //         cohort_run.run_id as run_id,
  //         response_id,
  //         run_response.response,
  //         run_response.response->>'value' as value,
  //         audio_transcripts.transcript as transcript,
  //         CASE run_response.response->>'isSkip' WHEN 'false' THEN FALSE
  //             ELSE TRUE
  //         END as is_skip,
  //         run_response.response->>'type' as type,
  //         run_response.created_at as created_at,
  //         run_response.ended_at as ended_at
  //     FROM run_response
  //     JOIN cohort_run ON run_response.run_id = cohort_run.run_id
  //     JOIN run ON run.id = cohort_run.run_id
  //     JOIN users ON users.id = run.user_id
  //     JOIN scenario ON scenario.id = run.scenario_id
  //     LEFT JOIN audio_transcripts ON audio_transcripts.key = run_response.response->>'value'
  //     WHERE cohort_run.cohort_id = ${id}
  //     AND run.scenario_id = ${scenario_id}
  //     ORDER BY cohort_run.run_id DESC
  //   `);

  //   responses.push(...result.rows);
  // }

  return result.rows;
}

async function linkCohortToRun(id, run_id) {
  if (!(id && run_id)) {
    throw new Error(
      'Link a cohort to a run requires a cohort id, run id and user id'
    );
  }

  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO cohort_run (cohort_id, run_id)
      VALUES (${id}, ${run_id})
      ON CONFLICT DO NOTHING;
    `);

    return result;
  });
}

async function getCohortUserRoles(id, user_id) {
  const result = await query(sql`
    SELECT ARRAY_AGG(role) AS roles
    FROM cohort_user_role
    WHERE cohort_id = ${id}
    AND user_id = ${user_id}
    AND ended_at IS NULL
  `);
  const roles = result.rowCount ? result.rows[0].roles : [];
  return { roles };
}

async function linkUserToCohort(cohort_id, user_id, role, action) {
  if (!(cohort_id && user_id)) {
    throw new Error(
      'Setting a cohort user role requires a cohort id and a user_id'
    );
  }

  return await withClientTransaction(async client => {
    let result;
    if (action === 'join') {
      result = await client.query(sql`
        INSERT INTO cohort_user_role (cohort_id, user_id, role)
        VALUES (${cohort_id}, ${user_id}, ${role})
        RETURNING *;
      `);
    }

    if (action === 'done') {
      const ended_at = new Date().toISOString();
      result = await client.query(sql`
        UPDATE cohort_user_role
        SET ended_at = ${ended_at}
        WHERE cohort_id = ${cohort_id} AND user_id = ${user_id}
        RETURNING *;
      `);
    }

    if (action === 'quit') {
      result = await client.query(sql`
        DELETE FROM cohort_user_role
        WHERE cohort_id = ${cohort_id} AND user_id = ${user_id}
        RETURNING *;
      `);
    }

    if (!result.rows.length) {
      // eslint-disable-next-line no-console
      console.log(result);
    }

    const cohortUsers = await getCohortUsers(cohort_id);
    // console.log(cohortUsers);
    return cohortUsers;
  });
}

async function addCohortUserRole(cohort_id, user_id, roles) {
  return withClientTransaction(async client => {
    const [role] = roles;
    const result = await client.query(sql`
      INSERT INTO cohort_user_role (cohort_id, user_id, role)
      VALUES (${cohort_id}, ${user_id}, ${role})
      ON CONFLICT DO NOTHING;
    `);
    return { addedCount: result.rowCount };
  });
}

async function deleteCohortUserRole(cohort_id, user_id, roles) {
  return withClientTransaction(async client => {
    const [role] = roles;
    const result = await client.query(sql`
      DELETE FROM cohort_user_role
      WHERE cohort_id = ${cohort_id}
      AND user_id = ${user_id}
      AND role = ${role}
    `);

    return { deletedCount: result.rowCount };
  });
}

exports.createCohort = createCohort;
exports.getCohort = getCohort;
exports.getCohortScenarios = getCohortScenarios;
exports.__getAggregatedCohort = __getAggregatedCohort;
exports.__getCohorts = __getCohorts;
exports.getCohorts = getCohorts;
exports.getCohortsCount = getCohortsCount;
exports.getCohortsSlice = getCohortsSlice;
exports.setCohort = setCohort;
exports.softDeleteCohort = softDeleteCohort;
exports.setCohortScenarios = setCohortScenarios;
exports.getCohortRunResponses = getCohortRunResponses;
exports.linkCohortToRun = linkCohortToRun;
exports.getCohortUserRoles = getCohortUserRoles;
exports.linkUserToCohort = linkUserToCohort;
exports.addCohortUserRole = addCohortUserRole;
exports.deleteCohortUserRole = deleteCohortUserRole;
