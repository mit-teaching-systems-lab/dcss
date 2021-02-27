const { sql, updateQuery, whereClause } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');
const format = require('pg-format');

async function setAgent(id, updates) {
  return await withClientTransaction(async client => {
    const result = await client.query(updateQuery('agent', { id }, updates));
    return result.rows[0];
  });
}

async function setAgentSocketConfiguration(id, configuration) {
  const result = await withClientTransaction(async client => {
    await client.query(`
      DELETE FROM agent_socket_configuration
      WHERE agent_id = ${id};
    `);

    const records = Object.entries(configuration).map(([key, value]) => [
      id,
      key,
      value
    ]);

    const formattedQuery = format(
      `
      INSERT INTO agent_socket_configuration
        (agent_id, key, value)
      VALUES %L
      RETURNING *;
    `,
      records
    );

    const result = await client.query(formattedQuery);

    return result.rows[0] || null;
  });

  if (!result) {
    throw new Error(`Could not set agent configuration`);
  }

  return result;
}

async function setAgentConfiguration(id, configuration) {
  const result = await withClientTransaction(async client => {
    await client.query(`
      DELETE FROM agent_configuration
      WHERE agent_id = ${id};
    `);

    const records = Object.entries(configuration).map(([key, value]) => [
      id,
      key,
      value
    ]);

    const formattedQuery = format(
      `
      INSERT INTO agent_configuration
        (agent_id, key, value)
      VALUES %L
      RETURNING *;
    `,
      records
    );

    const result = await client.query(formattedQuery);

    return result.rows[0] || null;
  });

  if (!result) {
    throw new Error(`Could not set agent configuration`);
  }

  return result;
}

async function setAgentInteraction(id, interaction) {
  const result = await withClientTransaction(async client => {
    await client.query(`
      DELETE FROM agent_interaction
      WHERE agent_id = ${id};
    `);

    const result = await client.query(`
      INSERT INTO agent_interaction
        (agent_id, interaction_id)
      VALUES
        (${id}, ${interaction.id})
      RETURNING *
    `);

    return result.rows[0] || null;
  });

  if (!result) {
    throw new Error(`Could not set agent interaction`);
  }

  return result;
}

async function createAgent(params) {
  const {
    name,
    description,
    endpoint,
    owner,
    interaction,
    configuration,
    socket
  } = params;

  if (!(name && owner.id)) {
    throw new Error('Creating an agent requires a user');
  }

  const agentCreated = await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO agent
        (name, description, endpoint, owner_id)
      VALUES
        (${name}, ${description}, ${endpoint}, ${owner.id})
      RETURNING *
    `);
    return result.rows[0] || null;
  });

  if (!agentCreated) {
    throw new Error(`Could not create agent`);
  }

  await setAgentSocketConfiguration(agentCreated.id, socket);
  await setAgentConfiguration(agentCreated.id, configuration);
  await setAgentInteraction(agentCreated.id, interaction);

  const agent = await query(sql`
    SELECT *
    FROM agent_view
    WHERE id = ${agentCreated.id}
  `);

  return agent.rows[0] || null;
}

async function getAgent(id) {
  const result = await query(sql`
    SELECT * FROM agent_view WHERE id = ${id}
  `);
  return result.rows[0] || null;
}

async function getAgents(where) {
  const result = await query(`
    SELECT *
    FROM agent_view
    ${whereClause(where)}
  `);
  return result.rows;
}

exports.createAgent = createAgent;
exports.getAgent = getAgent;
exports.getAgents = getAgents;
exports.setAgent = setAgent;
exports.setAgentSocketConfiguration = setAgentSocketConfiguration;
exports.setAgentConfiguration = setAgentConfiguration;
exports.setAgentInteraction = setAgentInteraction;
