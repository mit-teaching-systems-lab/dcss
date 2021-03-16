const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');
const { createTag, getLabels, TYPE_ID_FOR } = require('../tags/db');
const { createSlide, getScenarioSlides } = require('./slides/db');
const {
  createPersona,
  getPersonas,
  getPersonasDefault,
  linkPersonaToScenario
} = require('../personas/db');
const { getRunResponses } = require('../runs/db');
const { getUserById } = require('../session/db');

async function getScenarioCategories(id) {
  const result = await query(sql`
    SELECT c.name as name
    FROM scenario_tag s
    INNER JOIN categories c
    ON s.tag_id = c.id
    WHERE scenario_id = ${id};
  `);

  return result.rows.map(r => r.name);
}

async function getScenarioLabels(id) {
  const result = await query(sql`
    SELECT l.id as id, l.name as name
    FROM scenario_tag s
    INNER JOIN labels l
    ON s.tag_id = l.id
    WHERE scenario_id = ${id};
  `);

  return result.rows.map(r => r.name);
}

async function getScenarioPersonas(id) {
  const result = await query(sql`
    SELECT persona.*, scenario_persona.is_default
    FROM persona
    INNER JOIN scenario_persona
       ON persona.id = scenario_persona.persona_id
    WHERE scenario_persona.scenario_id = ${id}
      AND persona.deleted_at IS NULL
    ORDER BY persona.name;
  `);

  if (result.rowCount) {
    return result.rows;
  }

  let personas = await getPersonasDefault();

  for (let persona of personas) {
    await linkPersonaToScenario(persona.id, id);
  }

  return personas;
}

async function createScenarioConsent(consent) {
  const result = await query(sql`
    INSERT INTO consent (prose)
    VALUES (${consent.prose})
    RETURNING *;
  `);

  return result.rowCount && result.rows[0];
}

async function setScenarioConsent(id, consent) {
  const result = await query(sql`
    INSERT INTO scenario_consent (scenario_id, consent_id)
    VALUES (${id}, ${consent.id})
    RETURNING *;
  `);

  return result.rowCount && result.rows[0];
}

async function getScenarioConsent(id) {
  let results = await query(sql`
    SELECT c.id as id, c.prose as prose
    FROM scenario_consent s
    INNER JOIN consent c
    ON s.consent_id = c.id
    WHERE s.scenario_id = ${id}
    ORDER BY s.created_at DESC
    LIMIT 1;
  `);

  if (!results.rowCount) {
    results = await query(sql`
      INSERT INTO scenario_consent (scenario_id, consent_id)
      SELECT ${id}, id FROM consent WHERE is_default LIMIT 1
      RETURNING *;
    `);
  }

  return results.rows[0] || { id: null, prose: '' };
}

async function createFinishSlide(scenario_id, title = '') {
  return await createSlide({
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
      sur.roles,
      '{owner}' && sur.roles AS is_owner,
      ('{owner}' && sur.roles) OR ('{author}' && sur.roles) AS is_author,
      '{reviewer}' && sur.roles AS is_reviewer
    FROM user_role_detail
    INNER JOIN (
      SELECT scenario_id, user_id, ARRAY_AGG(role) AS roles
      FROM (SELECT * FROM scenario_user_role ORDER BY created_at) sur1
      WHERE scenario_id = ${scenario_id} AND ended_at IS NULL
      GROUP BY scenario_id, user_id
    ) sur
    ON user_role_detail.id = sur.user_id;
  `);

  return result.rows;
}

async function endScenarioUserRole(scenario_id, user_id) {
  return withClientTransaction(async client => {
    const result = await client.query(sql`
      DELETE FROM scenario_user_role
      WHERE scenario_id = ${scenario_id}
      AND user_id = ${user_id}
      RETURNING *;
    `);
    return { endedCount: result.rowCount };
  });
}

async function setScenarioUserRole(scenario_id, user_id, roles) {
  await endScenarioUserRole(scenario_id, user_id);

  return withClientTransaction(async client => {
    const [role] = roles;
    const result = await client.query(sql`
      INSERT INTO scenario_user_role (scenario_id, user_id, role)
      VALUES (${scenario_id}, ${user_id}, ${role})
      ON CONFLICT ON CONSTRAINT scenario_user_role_pkey
      DO UPDATE SET ended_at = null
      WHERE scenario_user_role.scenario_id = ${scenario_id}
      AND scenario_user_role.user_id = ${user_id}
      AND scenario_user_role.role = ${role}
      RETURNING *;
    `);
    return { addedCount: result.rowCount };
  });
}

async function getScenarioUserRoles(scenario_id, user_id) {
  const result = await query(sql`
    SELECT ARRAY_AGG(role) AS roles
    FROM scenario_user_role
    WHERE scenario_id = ${scenario_id}
    AND user_id = ${user_id}
    AND ended_at IS NULL
  `);
  const roles = result.rows.length ? result.rows[0].roles : [];
  return { roles };
}

// async function setScenarioUsers(scenario_id, userRoles) {
//   const users = [];
//   for (let { user_id, role } of userRoles) {
//     users.push(await setScenarioUserRole(scenario_id, user_id, [role]));
//   }
//   return users;
// }

async function createScenarioLock(scenario_id, user_id) {
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

  const scenario = results.rows[0];
  const users = await getScenarioUsers(scenario.id);
  // TODO: phase out "author"
  const author = await getUserById(scenario.author_id);
  delete scenario.author_id;

  const categories = await getScenarioCategories(scenario.id);
  const consent = await getScenarioConsent(scenario.id);
  const finish =
    (await getScenarioSlides(scenario.id)).find(slide => slide.is_finish) ||
    (await createFinishSlide(scenario.id));

  const personas = await getScenarioPersonas(scenario.id);
  const labels = await getScenarioLabels(scenario.id);
  const lock = await getScenarioLock(scenario.id);
  return {
    ...scenario,
    users,
    author,
    categories,
    consent,
    finish,
    labels,
    lock,
    personas
  };
}

async function getScenarios() {
  const results = await query(sql`
    SELECT id
    FROM scenario
    ORDER BY id DESC;
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
      (await createFinishSlide(row.id));
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

async function getScenariosByStatus(status) {
  const results = await query(sql`
    SELECT *
    FROM scenario
    WHERE status = ${status}
    ORDER BY id DESC;
  `);

  const scenarios = [];
  for (const row of results.rows) {
    scenarios.push(await getScenario(row.id));
  }

  return scenarios;
}

async function getScenariosSlice(direction, offset, limit) {
  // This intentionally does not use the sql`` because that
  // tag will attempt to put quotes around the output of
  // ${direction.toUpperCase()}
  const results = await query(`
    SELECT id
    FROM scenario
    ORDER BY id ${direction.toUpperCase()}
    OFFSET ${offset}
    LIMIT ${limit}
  `);

  const scenarios = [];

  for (const row of results.rows) {
    scenarios.push(await getScenario(row.id));
  }

  return scenarios;
}

async function getScenariosCount() {
  const results = await query(sql`
    SELECT COUNT(id) FROM scenario
  `);

  let count = 0;

  if (results.rows.length) {
    ({ count } = results.rows[0]);
  }

  return count;
}

async function createScenario(user_id, title, description) {
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

  // const roles = ['owner', 'author'];
  // const users = await setScenarioUsers(
  //   scenario.id,
  //   roles.map(role => ({ user_id, role }))
  // );
  await setScenarioUserRole(scenario.id, user_id, ['owner']);

  const consent = await setScenarioConsent(scenario.id, consentDefault);
  const finish = await createFinishSlide(scenario.id);
  const lock = await createScenarioLock(scenario.id, user_id);

  return {
    ...scenario,
    users: [],
    consent,
    finish,
    lock
  };
}

async function setScenario(scenarioId, scenario) {
  scenario.updated_at = new Date().toISOString();
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

async function setScenarioLabels(id, labels) {
  const storedLabels = (await getLabels()).map(l => l.name);

  return withClientTransaction(async client => {
    for (let label of labels) {
      if (!storedLabels.includes(label)) {
        const index = labels.indexOf(label);
        const tag = await createTag(label, TYPE_ID_FOR.LABEL);
        labels[index] = tag.name;
      }
    }

    await client.query(`
      DELETE FROM scenario_tag
      WHERE tag_id in (
        SELECT id FROM labels
      )
      AND scenario_id = ${id};
    `);

    const result = await client.query(sql`
      INSERT INTO scenario_tag (scenario_id, tag_id)
      SELECT ${id} as scenario_id, labels.id FROM
      jsonb_array_elements_text(${labels}) as x
      JOIN labels ON labels.name = x
      ON CONFLICT DO NOTHING;
    `);

    return labels;
  });
}

function personasMatch(a, b) {
  return (
    a.name === b.name && a.description === b.description && a.color === b.color
  );
}

async function setScenarioPersonas(id, personas) {
  return withClientTransaction(async client => {
    const result = await client.query(`
      SELECT persona_id
      FROM scenario_persona
      WHERE scenario_id = ${id}
    `);
    let ids = personas.map(({ id }) => id);

    if (result.rowCount) {
      result.rows.forEach(row => {
        const index = ids.indexOf(row.persona_id);
        if (index !== -1) {
          ids.splice(index, 1);
        }
      });
    }

    // await client.query(`
    //   DELETE FROM scenario_persona
    //   WHERE scenario_id = ${id};
    // `);

    if (ids.length) {
      // DO NOT USE sql`` HERE!
      const result = await client.query(`
        INSERT INTO scenario_persona (scenario_id, persona_id)
        SELECT ${id} as scenario_id, value::int FROM jsonb_array_elements('[${ids}]')
        ON CONFLICT DO NOTHING
        RETURNING *;
      `);

      return result.rows;
    }

    return [];
  });
}

async function deleteScenario(id) {
  let result = await query(sql`
    DELETE FROM scenario_snapshot WHERE scenario_id >= ${id};
    DELETE FROM scenario_persona WHERE scenario_id >= ${id};
    DELETE FROM scenario_tag WHERE scenario_id >= ${id};
    DELETE FROM scenario_lock WHERE scenario_id >= ${id};
    DELETE FROM scenario_consent WHERE scenario_id >= ${id};
    DELETE FROM scenario_user_role WHERE scenario_id >= ${id};
    DELETE FROM scenario_tag WHERE scenario_id >= ${id};
    DELETE FROM slide WHERE scenario_id >= ${id};
    DELETE FROM scenario WHERE id >= ${id};
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
          // If the component itself is a prompt (identified by a responseId)
          // OR, if the component embeds another component which is a prompt.
          if (component.responseId ||
              component.component && component.component.responseId) {

            const pushable = component.component && component.component.responseId
              ? component.component
              : component;

            const isConditional = pushable === component.component;

            accum.push({
              slide,
              isConditional,
              ...pushable
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

// TODO: determine if this is still in use
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
    responses.push(await getRunResponses(run_id));
  }

  return { prompts, responses };
}

async function createScenarioSnapshot(scenario_id, user_id, snapshot) {
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
exports.createScenario = createScenario;
exports.setScenario = setScenario;
exports.getScenario = getScenario;
exports.deleteScenario = deleteScenario;
exports.softDeleteScenario = softDeleteScenario;
exports.getHistoryForScenario = getHistoryForScenario;
exports.getScenarioById = getScenario;
exports.getScenarioByRun = getScenarioByRun;
exports.getScenarioPrompts = getScenarioPrompts;

// Scenarios
exports.getScenarios = getScenarios;
exports.getScenariosByStatus = getScenariosByStatus;
exports.getScenariosCount = getScenariosCount;
exports.getScenariosSlice = getScenariosSlice;

// Scenario Snapshot/History
exports.createScenarioSnapshot = createScenarioSnapshot;

// Scenario Lock
exports.createScenarioLock = createScenarioLock;
exports.getScenarioLock = getScenarioLock;
exports.endScenarioLock = endScenarioLock;

// Scenario Roles
exports.getScenarioUserRoles = getScenarioUserRoles;
exports.setScenarioUserRole = setScenarioUserRole;
exports.endScenarioUserRole = endScenarioUserRole;

// Scenario Consent
exports.createScenarioConsent = createScenarioConsent;
exports.setScenarioConsent = setScenarioConsent;
exports.getScenarioConsent = getScenarioConsent;

// Scenario Categories
exports.setScenarioCategories = setScenarioCategories;

// Scenario Labels
exports.setScenarioLabels = setScenarioLabels;

// Scenario Personas
exports.setScenarioPersonas = setScenarioPersonas;
