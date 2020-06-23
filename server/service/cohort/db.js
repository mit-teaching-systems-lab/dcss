const { sql } = require('../../util/sqlHelpers');
const { query, withClient, withClientTransaction } = require('../../util/db');
// const rolesDb = require('../roles/db');

async function getCohortScenarios(cohort_id) {
  return await withClient(async client => {
    const result = await client.query(sql`
      SELECT scenario_id as id
      FROM cohort_scenario
      INNER JOIN scenario
         ON cohort_scenario.scenario_id = scenario.id
      WHERE cohort_scenario.cohort_id = ${cohort_id}
        AND scenario.deleted_at IS NULL
      ORDER BY cohort_scenario.id;
    `);
    return result.rows.map(row => row.id);
  });
}

async function getCohortRuns(cohort_id) {
  return await withClient(async client => {
    const result = await client.query(sql`
      SELECT *
      FROM run
      INNER JOIN cohort_run
         ON run.id = cohort_run.run_id
      WHERE cohort_run.cohort_id = ${cohort_id};
    `);

    return result.rows;
  });
}

async function getCohortUsers(cohort_id) {
  return await withClient(async client => {
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
    const result = await client.query(sql`
      SELECT
        id,
        email,
        username,
        cohort_id,
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

    return result.rows;
  });
}

exports.createCohort = async ({ name, user_id }) => {
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
};

const getAggregatedCohort = async cohort => {
  const runs = await getCohortRuns(cohort.id);
  const scenarios = await getCohortScenarios(cohort.id);
  const users = await getCohortUsers(cohort.id);
  const usersById = users.reduce((accum, user) => {
    accum[user.id] = user;
    return accum;
  }, {});
  return {
    ...cohort,
    runs,
    scenarios,
    users,
    usersById
  };
};

exports.getCohort = async id => {
  return await withClient(async client => {
    const result = await client.query(sql`
      SELECT cohort.id, cohort.name, cohort.created_at, cur.roles
      FROM cohort
      INNER JOIN (
        SELECT DISTINCT ON (cohort_id) cohort_id, user_id, ARRAY_AGG(role) AS roles
        FROM (SELECT * FROM cohort_user_role ORDER BY created_at) cur1
        WHERE cohort_id = ${id}
        GROUP BY cohort_id, user_id
      ) cur
      ON cohort.id = cur.cohort_id;
    `);
    return result.rowCount ? getAggregatedCohort(result.rows[0]) : {};
  });
};

exports.getMyCohorts = async user_id => {
  return await withClient(async client => {
    const result = await client.query(sql`
      SELECT cohort.id, cohort.name, cohort.created_at, cur.roles
      FROM cohort
      INNER JOIN (
        SELECT cohort_id, user_id, ARRAY_AGG(role) AS roles
        FROM (SELECT * FROM cohort_user_role ORDER BY created_at) cur1
        GROUP BY cohort_id, user_id
      ) cur
      ON cohort.id = cur.cohort_id
      WHERE cur.user_id = ${user_id}
      ORDER BY cohort.created_at DESC;
    `);

    const cohorts = [];
    for (const row of result.rows) {
      cohorts.push(await getAggregatedCohort(row));
    }
    return cohorts;
  });
};

exports.getAllCohorts = async () => {
  return await withClient(async client => {
    const result = await client.query(sql`
      SELECT * FROM cohort;
    `);

    const cohorts = [];
    for (const row of result.rows) {
      cohorts.push(await getAggregatedCohort(row));
    }
    return cohorts;
  });
};

exports.setCohort = async () => {
  // console.log('setCohort', params);

  return {};
  // return await withClient(async client => {
  //     const result = await client.query(sql`
  //         SELECT * FROM cohort WHERE id = ${cohort_id}
  //     `);
  //     return result.rows[0];
  // });
};

exports.setCohortScenarios = async (id, scenarios) => {
  return await withClientTransaction(async client => {
    await client.query(sql`
      DELETE FROM cohort_scenario
      WHERE cohort_id = ${Number(id)};
    `);

    // TODO: migrate this into SQL as
    //
    // INSERT INTO cohort_scenario (cohort_id, scenario_id)
    //   SELECT ${id} as cohort_id, t.scenario_id
    //   FROM jsonb_array_elements_text(${scenarios}) AS t (scenario_id)
    // ON CONFLICT DO NOTHING;

    for (const scenario_id of scenarios) {
      await client.query(sql`
        INSERT INTO cohort_scenario (cohort_id, scenario_id)
        VALUES (${Number(id)}, ${Number(scenario_id)});
      `);
    }

    return scenarios;
  });
};

exports.getCohortRunResponses = async ({ id, scenario_id, participant_id }) => {
  return await withClientTransaction(async client => {
    let responses = [];
    if (participant_id) {
      const result = await client.query(sql`
        SELECT
            run.user_id as user_id,
            username,
            scenario.id as scenario_id,
            scenario.title as scenario_title,
            cohort_run.run_id as run_id,
            response_id,
            run_response.response,
            run_response.response->>'value' as value,
            audio_transcript.transcript as transcript,
            CASE run_response.response->>'isSkip' WHEN 'false' THEN FALSE
                ELSE TRUE
            END as is_skip,
            run_response.response->>'type' as type,
            run_response.created_at as created_at,
            run_response.ended_at as ended_at
        FROM run_response
        JOIN cohort_run ON run_response.run_id = cohort_run.run_id
        JOIN run ON run.id = cohort_run.run_id
        JOIN users ON users.id = run.user_id
        JOIN scenario ON scenario.id = run.scenario_id
        LEFT JOIN audio_transcript ON audio_transcript.key = run_response.response->>'value'
        WHERE cohort_run.cohort_id = ${id}
        AND run.user_id = ${participant_id}
        ORDER BY cohort_run.run_id DESC
    `);

      responses.push(...result.rows);
    } else {
      const result = await client.query(sql`
        SELECT
            run.user_id as user_id,
            username,
            scenario.id as scenario_id,
            scenario.title as scenario_title,
            cohort_run.run_id as run_id,
            response_id,
            run_response.response,
            run_response.response->>'value' as value,
            audio_transcript.transcript as transcript,
            CASE run_response.response->>'isSkip' WHEN 'false' THEN FALSE
                ELSE TRUE
            END as is_skip,
            run_response.response->>'type' as type,
            run_response.created_at as created_at,
            run_response.ended_at as ended_at
        FROM run_response
        JOIN cohort_run ON run_response.run_id = cohort_run.run_id
        JOIN run ON run.id = cohort_run.run_id
        JOIN users ON users.id = run.user_id
        JOIN scenario ON scenario.id = run.scenario_id
        LEFT JOIN audio_transcript ON audio_transcript.key = run_response.response->>'value'
        WHERE cohort_run.cohort_id = ${id}
        AND run.scenario_id = ${scenario_id}
        ORDER BY cohort_run.run_id DESC
      `);

      responses.push(...result.rows);
    }

    return responses;
  });
};

exports.linkCohortToRun = async (id, run_id) => {
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
};

exports.getCohortUserRoles = async (user_id, id) => {
  return withClient(async client => {
    const result = await client.query(sql`
      SELECT ARRAY_AGG(role) AS roles
      FROM cohort_user_role
      WHERE cohort_id = ${id}
      AND user_id = ${user_id}
      AND ended_at IS NULL
    `);
    const roles = result.rows.length ? result.rows[0].roles : [];
    return { roles };
  });
};

exports.getSiteUserRoles = async user_id => {
  return withClient(async client => {
    const result = await client.query(sql`
      SELECT ARRAY_AGG(role) AS roles
      FROM user_role
      WHERE user_id = ${user_id};
    `);
    const roles = result.rows.length ? result.rows[0].roles : [];
    return { roles };
  });
};

exports.linkUserToCohort = async (cohort_id, user_id, role, action) => {
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

    return result && result.rows.length && getCohortUsers(cohort_id);
  });
};

exports.addCohortUserRole = async (cohort_id, user_id, roles) => {
  return withClientTransaction(async client => {
    // const result = await client.query(sql`
    //   INSERT INTO cohort_user_role (cohort_id, user_id, role)
    //     SELECT ${cohort_id} as cohort_id, ${user_id} as user_id, t.role
    //     FROM jsonb_array_elements_text(${roles}) AS t (role)
    //   ON CONFLICT DO NOTHING;
    // `);
    const [role] = roles;
    const result = await client.query(sql`
      INSERT INTO cohort_user_role (cohort_id, user_id, role)
      VALUES (${cohort_id}, ${user_id}, ${role})
      ON CONFLICT DO NOTHING;
    `);
    return { addedCount: result.rowCount };
  });
};

exports.deleteCohortUserRole = async (cohort_id, user_id, roles) => {
  return withClientTransaction(async client => {
    // const result = await client.query(sql`
    //   DELETE FROM cohort_user_role
    //   WHERE cohort_id = ${cohort_id}
    //   AND user_id = ${user_id}
    //   AND role IN (SELECT jsonb_array_elements_text(${roles}));`);

    const [role] = roles;
    const result = await client.query(sql`
      DELETE FROM cohort_user_role
      WHERE cohort_id = ${cohort_id}
      AND user_id = ${user_id}
      AND role = ${role}
    `);

    return { deletedCount: result.rowCount };
  });
};
// exports.linkUserToCohort = async ({ cohort_id, user_id, role }) => {
//   return withClientTransaction(async client => {
//     const add = await client.query(sql`
// INSERT INTO user_role (user_id, role)
//     SELECT ${user_id} as user_id, t.role FROM jsonb_array_elements_text(${roles}) AS t (role)
//     ON CONFLICT DO NOTHING;
//             `);
//     const del = await client.query(sql`
// DELETE FROM user_role WHERE user_id = ${user_id} AND role NOT IN (SELECT jsonb_array_elements_text(${roles}));
//             `);
//     return {
//       addedCount: add.rowCount || 0,
//       deletedCount: del.rowCount || 0,
//       rolesCount: roles.length || 0
//     };
//   });
// };

exports.listUserCohorts = async user_id => {
  const result = await query(sql`
    SELECT cohort.id, cohort.name, cohort_user_role.role
    FROM cohort
    LEFT JOIN cohort_user_role
        ON cohort_user_role.cohort_id = cohort.id
    WHERE cohort_user_role.user_id = ${user_id}
  `);
  return result.rows;
};
