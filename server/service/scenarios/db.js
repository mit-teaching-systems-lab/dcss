const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');
const { addSlide, getScenarioSlides } = require('./slides/db');
const { getRunResponses } = require('../runs/db');
const { getUserById } = require('../auth/db');

async function getScenarioCategories(scenarioId) {
  const scenarioCategoriesResults = await query(sql`
        SELECT c.name as name
        FROM scenario_tag s
        INNER JOIN categories c
        ON s.tag_id = c.id
        where scenario_id = ${scenarioId};
    `);

  return scenarioCategoriesResults.rows.map(r => r.name);
}

async function addScenarioConsent(consent) {
  const result = await query(sql`
        INSERT INTO consent (prose)
        VALUES (${consent.prose})
        RETURNING *;
    `);

  return result.rowCount && result.rows[0];
}

async function setScenarioConsent(scenarioId, consent) {
  const result = await query(sql`
        INSERT INTO scenario_consent (scenario_id, consent_id)
        VALUES (${scenarioId}, ${consent.id})
        RETURNING *;
    `);

  return result.rowCount && result.rows[0];
}

async function getScenarioConsent(scenarioId) {
  let results = await query(sql`
        SELECT c.id as id, c.prose as prose
        FROM scenario_consent s
        INNER JOIN consent c
        ON s.consent_id = c.id
        WHERE s.scenario_id = ${scenarioId}
        ORDER BY s.created_at DESC
        LIMIT 1;
    `);

  if (!results.rowCount) {
    results = await query(sql`
            INSERT INTO scenario_consent (scenario_id, consent_id)
            SELECT ${scenarioId}, id FROM consent WHERE is_default LIMIT 1
            RETURNING *;
        `);
  }

  return results.rows[0] || { id: null, prose: '' };
}

async function addFinishSlide(scenario_id, title = '') {
  return await addSlide({
    scenario_id,
    title,
    is_finish: true,
    components:
      '[{"html": "<h2>Thanks for participating!</h2>","type": "Text"}]'
  });
}

async function getScenarioUsers(scenario_id) {
  const result = await query(sql`
    SELECT
      id,
      email,
      username,
      personalname,
      roles,
      '{owner}' && roles AS is_owner,
      '{author}' && roles AS is_author,
      '{reviewer}' && roles AS is_reviewer
    FROM users
    INNER JOIN (
      SELECT scenario_id, user_id, ARRAY_AGG(role) AS roles
      FROM (SELECT * FROM scenario_user_role ORDER BY created_at) sur1
      WHERE scenario_id = ${scenario_id} AND ended_at IS NULL
      GROUP BY scenario_id, user_id
    ) sur
    ON users.id = sur.user_id;
  `);

  return result.rows;
}

async function addScenarioUserRole(scenario_id, user_id, roles) {
  return withClientTransaction(async client => {
    const [role] = roles;
    const result = await client.query(sql`
      INSERT INTO scenario_user_role (scenario_id, user_id, role)
      VALUES (${scenario_id}, ${user_id}, ${role})
      ON CONFLICT DO NOTHING
      RETURNING *;
    `);
    return { addedCount: result.rowCount };
  });
}

async function endScenarioUserRole(scenario_id, user_id, roles) {
  return withClientTransaction(async client => {
    const [role] = roles;
    const result = await client.query(sql`
      UPDATE scenario_user_role
      SET ended_at = CURRENT_TIMESTAMP
      WHERE scenario_id = ${scenario_id}
      AND user_id = ${user_id}
      AND role = ${role}
      RETURNING *;
    `);

    return { deletedCount: result.rowCount };
  });
}

exports.getScenarioUserRoles = async (user_id, scenario_id) => {
  const result = await query(sql`
    SELECT ARRAY_AGG(role) AS roles
    FROM scenario_user_role
    WHERE scenario_id = ${scenario_id}
    AND user_id = ${user_id}
    AND ended_at IS NULL
  `);
  const roles = result.rows.length ? result.rows[0].roles : [];
  return { roles };
};

async function setScenarioUsers(scenario_id, userRoles) {
  const users = [];
  for (let { user_id, role } of userRoles) {
    users.push(await addScenarioUserRole(scenario_id, user_id, [role]));
  }
  return users;
}

async function addScenarioLock(scenario_id, user_id) {
  return withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO scenario_lock (scenario_id, user_id)
      VALUES (${scenario_id}, ${user_id})
      ON CONFLICT DO NOTHING
      RETURNING *;
    `);

    return (result.rowCount && result.rows[0]) || null;
  });
}

async function endScenarioLock(scenario_id, user_id) {
  return withClientTransaction(async client => {
    const result = await client.query(sql`
      UPDATE scenario_lock
      SET ended_at = CURRENT_TIMESTAMP
      WHERE scenario_id = ${scenario_id}
      AND user_id = ${user_id}
      AND ended_at IS NULL
      RETURNING *;
    `);

    return (result.rowCount && result.rows[0]) || null;
  });
}

async function getScenarioLock(scenario_id) {
  const result = await query(sql`
    SELECT *
    FROM scenario_lock
    WHERE scenario_id = ${scenario_id}
    AND ended_at IS NULL;
  `);
  return result.rows[0] || null;
}

async function getScenario(scenario_id) {
  const results = await query(sql`
    SELECT *
    FROM scenario
    WHERE id = ${scenario_id};
  `);

  const { author_id } = results.rows[0];
  const users = await getScenarioUsers(scenario_id);
  // TODO: phase out "author"
  const author = await getUserById(author_id);
  const categories = await getScenarioCategories(scenario_id);
  const consent = await getScenarioConsent(scenario_id);
  const finish =
    (await getScenarioSlides(scenario_id)).find(slide => slide.is_finish) ||
    (await addFinishSlide(scenario_id));

  const lock = await getScenarioLock(scenario_id);

  const scenario = results.rows[0];
  delete scenario.author_id;
  return {
    ...scenario,
    users,
    author,
    categories,
    consent,
    finish,
    lock
  };
}

async function getAllScenarios() {
  const results = await query(sql`
    SELECT * FROM scenario ORDER BY created_at DESC;
  `);

  const scenarios = [];
  for (const row of results.rows) {
    const scenario = await getScenario(row.id);
    scenarios.push(scenario);
    /*
    const users = await getScenarioUsers(row.id);
    // TODO: phase out "author"
    const author = await getUserById(row.author_id);
    const categories = await getScenarioCategories(row.id);
    const consent = await getScenarioConsent(row.id);
    const finish =
      (await getScenarioSlides(row.id)).find(slide => slide.is_finish) ||
      (await addFinishSlide(row.id));
    const lock = await getScenarioLock(row.id);

    scenarios.push({
      ...row,
      users,
      author,
      categories,
      consent,
      finish,
      lock
    });
    */
  }

  return scenarios;
}

async function addScenario(user_id, title, description) {
  const scenarioInsert = await query(sql`
    INSERT INTO scenario (author_id, title, description)
    VALUES (${user_id}, ${title}, ${description})
    RETURNING *;
  `);

  const consentSelect = await query(sql`
    SELECT id FROM consent WHERE is_default
  `);
  const consentDefault = consentSelect.rows[0];
  const scenario = scenarioInsert.rows[0];

  const roles = ['owner', 'author'];
  const users = await setScenarioUsers(
    scenario.id,
    roles.map(role => ({ user_id, role }))
  );

  const consent = await setScenarioConsent(scenario.id, consentDefault);
  const finish = await addFinishSlide(scenario.id);
  const lock = await addScenarioLock(scenario.id, user_id);

  return {
    ...scenario,
    users,
    consent,
    finish,
    lock
  };
}

async function setScenario(scenarioId, scenario) {
  const result = await query(
    updateQuery('scenario', { id: scenarioId }, scenario)
  );
  return result.rows[0];
}

async function addScenarioCategory(scenarioId, category) {
  const insertedRow = await query(sql`
        WITH t AS (SELECT id as tag_id FROM tag WHERE name=${category})
        INSERT INTO scenario_tag (scenario_id, tag_id)
        SELECT CAST(${scenarioId} as INTEGER) as scenario_id, tag_id from t;
    `);

  return insertedRow;
}

async function deleteScenarioCategory(scenarioId, category) {
  const deletedRow = await query(sql`
        DELETE
        FROM scenario_tag s
        USING categories c
        WHERE
            s.tag_id = c.id AND
            s.scenario_id=${scenarioId} AND
            c.name=${category};
    `);

  return deletedRow;
}

async function setScenarioCategories(scenarioId, categories) {
  const currentCategoriesResults = await query(sql`
        SELECT s.scenario_id, c.name as category
        FROM scenario_tag s
        INNER JOIN categories c on s.tag_id = c.id
        WHERE scenario_id=${scenarioId};
    `);

  // This is the list of categories that already exist in current categories
  const currentCategories = currentCategoriesResults.rows.map(r => r.category);

  // We want to get the diff of currentCategories and categoriesChecked
  //     to delete the current categories that are left over
  const categoriesChecked = [];
  let promises = [];

  for (let category of categories) {
    if (currentCategories.length > 0 && currentCategories.includes(category)) {
      categoriesChecked.push(category);
    } else {
      promises.push(addScenarioCategory(scenarioId, category));
    }
  }

  // This filter will return all the categories that need to be deleted
  const toDelete = currentCategories.filter(
    c => categoriesChecked.indexOf(c) < 0
  );

  for (let category of toDelete) {
    promises.push(deleteScenarioCategory(scenarioId, category));
  }

  return Promise.all(promises);
}

async function deleteScenario(id) {
  let result;

  result = await query(sql`
    DELETE FROM scenario_consent WHERE scenario_id = ${id};
  `);

  result = await query(sql`
    DELETE FROM scenario_tag WHERE scenario_id = ${id};
  `);

  // TODO: need to handle the previous result

  result = await query(sql`
    DELETE FROM slide WHERE scenario_id = ${id};
  `);

  // TODO: need to handle the previous result

  result = await query(sql`
    DELETE FROM scenario WHERE id = ${id};
  `);

  return { deletedCount: result.rowCount };
}

async function softDeleteScenario(id) {
  const result = await query(sql`
    UPDATE scenario
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *;
  `);
  return result.rows[0];
}

async function getScenarioByRun(userId) {
  const result = await query(sql`
        SELECT DISTINCT * FROM scenario
        WHERE id IN
        (
            SELECT scenario_id
            FROM run
            WHERE user_id = ${userId}
        );
    `);

  return result.rows;
}

async function getScenarioPrompts(scenario_id) {
  const slides = await getScenarioSlides(scenario_id);
  const components = slides.reduce((accum, slide) => {
    if (slide.components && slide.components.length) {
      accum.push(
        ...slide.components.reduce((accum, component) => {
          if (component.responseId) {
            accum.push({
              slide,
              ...component
            });
          }
          return accum;
        }, [])
      );
    }
    return accum;
  }, []);

  return components;
}

async function getHistoryForScenario(params) {
  const {
    // TODO: implement support for limiting by cohort
    cohort_id,
    scenario_id
  } = params;
  let results;

  if (cohort_id) {
    results = await query(sql`
      SELECT run_id
      FROM cohort_run
      JOIN run ON run.id = cohort_run.run_id
      WHERE run.consent_granted_by_user = true
      AND run.scenario_id = ${scenario_id};
    `);
  } else {
    results = await query(sql`
      SELECT id AS run_id
      FROM run
      WHERE consent_granted_by_user = true
      AND scenario_id = ${scenario_id};
    `);
  }

  const prompts = await getScenarioPrompts(scenario_id);
  const responses = [];

  for (const { run_id } of results.rows) {
    responses.push(await getRunResponses({ run_id }));
  }

  return { prompts, responses };
}

async function setScenarioSnapshot(scenario_id, user_id, snapshot) {
  return withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO scenario_snapshot (scenario_id, user_id, snapshot)
      VALUES (${scenario_id}, ${user_id}, ${snapshot})
      ON CONFLICT DO NOTHING
      RETURNING *;
    `);
    return result.rowCount && result.rows[0];
  });
}

// Scenario
exports.addScenario = addScenario;
exports.setScenario = setScenario;
exports.getScenario = getScenario;
exports.deleteScenario = deleteScenario;
exports.softDeleteScenario = softDeleteScenario;
exports.getAllScenarios = getAllScenarios;
exports.getHistoryForScenario = getHistoryForScenario;
exports.getScenarioByRun = getScenarioByRun;
exports.getScenarioPrompts = getScenarioPrompts;

// Scenario Snapshot/History
exports.setScenarioSnapshot = setScenarioSnapshot;

// Scenario Lock
exports.addScenarioLock = addScenarioLock;
exports.getScenarioLock = getScenarioLock;
exports.endScenarioLock = endScenarioLock;

// Scenario Roles
exports.addScenarioUserRole = addScenarioUserRole;
exports.endScenarioUserRole = endScenarioUserRole;

// Scenario Consent
exports.addScenarioConsent = addScenarioConsent;
exports.setScenarioConsent = setScenarioConsent;
exports.getScenarioConsent = getScenarioConsent;

// Scenario Categories
exports.setScenarioCategories = setScenarioCategories;
