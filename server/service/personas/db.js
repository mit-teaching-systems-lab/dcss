const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');

exports.linkPersonaToScenario = async (persona_id, scenario_id) => {
  return await withClientTransaction(async client => {
    const link = await client.query(sql`
      INSERT INTO scenario_persona (persona_id, scenario_id)
      VALUES (${persona_id}, ${scenario_id})
      ON CONFLICT DO NOTHING
      RETURNING *
    `);

    if (!link.rowCount) {
      return null;
    }
    return link.rows[0];
  });
};

exports.createPersona = async (props) => {
  const {
    author_id, name, color, description, scenario_id
  } = props;

  if (!author_id || !name || !color || !description) {
    throw new Error(
      'Creating a persona requires a user id, name, color and description.'
    );
  }

  return await withClientTransaction(async client => {
    const create = await client.query(sql`
      INSERT INTO persona (name, color, description, author_id)
      VALUES (${name}, ${color}, ${description}, ${author_id})
      RETURNING *
    `);

    if (!create.rowCount) {
      return null;
    }

    const persona = create.result[0];

    if (scenario_id) {
      await exports.linkPersonaToScenario(persona.id, scenario_id);
    }

    return persona;
  });
};

exports.getPersonaById = async id => {
  const result = await query(sql`
    SELECT *
    FROM persona
    WHERE id = ${id}
  `);
  return result.rowCount ? result.rows[0] : null;
};

exports.getPersonasByUserId = async (user_id) => {
  const result = await query(sql`
    SELECT *
    FROM persona
    WHERE author_id = ${user_id}
    ORDER BY created_at DESC
  `);

  return result.rows;
};

exports.getPersonasByScenarioId = async (scenario_id) => {
  const result = await query(sql`
    SELECT *
    FROM persona
    WHERE author_id = ${user_id}
    ORDER BY created_at DESC

    SELECT persona.*
    FROM persona
    INNER JOIN scenario_persona
       ON persona.id = scenario_persona.persona_id
    WHERE scenario_persona.scenario_id = ${scenario_id}
      AND scenario.deleted_at IS NULL
    ORDER BY persona.name;
  `);

  return result.rows;
};

exports.getPersonas = async () => {
  const result = await query(sql`
    SELECT *
    FROM persona
    WHERE author_id = ${user_id}
    ORDER BY created_at DESC
  `);

  return result.rows;
};

exports.setPersonaById = async (id, updates) => {
  return await withClientTransaction(async client => {
    const result = await client.query(updateQuery('persona', { id }, updates));
    return result.rows[0];
  });
};

exports.deletePersonaById = async id => {
  return await withClientTransaction(async client => {
    const result = await query(sql`
      UPDATE persona
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `);
    return result.rows[0];
  });
};
