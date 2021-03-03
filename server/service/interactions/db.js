const { sql, updateQuery, whereClause } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');
const format = require('pg-format');

async function setInteraction(id, updates) {
  return await withClientTransaction(async client => {
    const result = await client.query(
      updateQuery('interaction', { id }, updates)
    );
    return result.rows[0];
  });
}

async function createInteraction(params) {
  const { name, description, owner } = params;

  const interactionCreated = await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO interaction
        (name, description, owner_id)
      VALUES
        (${name}, ${description}, ${owner.id})
      RETURNING *
    `);
    return result.rows[0] || null;
  });

  if (!interactionCreated) {
    throw new Error(`Could not create interaction`);
  }

  const interaction = await query(sql`
    SELECT *
    FROM interaction_view
    WHERE id = ${interactionCreated.id}
  `);

  return interaction.rows[0] || null;
}

async function getInteraction(id) {
  const result = await query(sql`
    SELECT *
    FROM interaction_view
    WHERE id = ${id}
  `);
  return result.rows[0] || null;
}

async function getInteractions() {
  const result = await query(sql`
    SELECT *
    FROM interaction_view
    WHERE deleted_at IS NULL
  `);
  return result.rows;
}

async function getInteractionsTypes() {
  const result = await query(sql`
    SELECT *
    FROM interaction_type
  `);
  return result.rows;
}

exports.createInteraction = createInteraction;
exports.getInteraction = getInteraction;
exports.getInteractions = getInteractions;
exports.getInteractionsTypes = getInteractionsTypes;
exports.setInteraction = setInteraction;
