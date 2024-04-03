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
    await client.query(sql`
      DELETE FROM agent_socket_configuration
      WHERE agent_id = ${id};
    `);

    if (Object.entries(configuration).length === 0) {
      return null;
    }

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
  return result;
}

async function setAgentConfiguration(id, configuration) {
  const result = await withClientTransaction(async client => {
    await client.query(sql`
      DELETE FROM agent_configuration
      WHERE agent_id = ${id};
    `);

    if (Object.entries(configuration).length === 0) {
      return null;
    }

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

  return result;
}

async function setAgentInteraction(id, interaction) {
  const result = await withClientTransaction(async client => {
    await client.query(sql`
      DELETE FROM agent_interaction
      WHERE agent_id = ${id};
    `);

    const result = await client.query(sql`
      INSERT INTO agent_interaction
        (agent_id, interaction_id)
      VALUES
        (${id}, ${interaction.id})
      RETURNING *;
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
    title,
    name = '',
    description,
    endpoint,
    owner,
    interaction,
    configuration,
    socket
  } = params;

  const agentCreated = await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO agent
        (title, name, description, endpoint, owner_id)
      VALUES
        (${title}, ${name}, ${description}, ${endpoint}, ${owner.id})
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

async function getAgentResponses(agent_id, run_id, recipient_id) {
  // SELECT *
  // FROM (
  //   SELECT DISTINCT ON (recipient_id, prompt_response_id) *
  //   FROM agent_response
  // ) AS s
  // WHERE agent_id = ${agent_id}
  // AND run_id = ${run_id}
  // AND recipient_id = ${recipient_id}
  // ORDER BY created_at DESC;
  const result = await query(sql`
    SELECT *
    FROM agent_response
    WHERE agent_id = ${agent_id}
    AND run_id = ${run_id}
    AND recipient_id = ${recipient_id}
    ORDER BY created_at ASC;
  `);

  const responses = {};

  for (let row of result.rows) {
    responses[row.prompt_response_id] = row;
  }

  return Object.values(responses);
}

async function insertNewAgentResponse(
  agent_id,
  chat_id,
  interaction_id,
  prompt_response_id,
  recipient_id,
  response_id,
  run_id,
  response
) {
  const result = await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO agent_response
        (
          agent_id,
          chat_id,
          interaction_id,
          prompt_response_id,
          recipient_id,
          response_id,
          run_id,
          response
        )
      VALUES
        (
          ${agent_id},
          ${chat_id},
          ${interaction_id},
          ${prompt_response_id},
          ${recipient_id},
          ${response_id},
          ${run_id},
          ${response}
        )
      ON CONFLICT DO NOTHING
      RETURNING *;
    `);
    return result.rows[0] || null;
  });

  return result;
}

async function getScenarioAgentPrompts(scenario_id) {
  const result = await query(sql`
  WITH c AS (
    SELECT
      components.id AS id,
      s.id AS slide_id,
      s.scenario_id AS scenario_id,
      components.required,
      components."responseId" AS response_id,
      components.agent->>'id' AS agent_id,
      components.persona,
      components.type
    FROM
      slide s,
      jsonb_to_recordset(s.components) AS components(
        id TEXT,
        required BOOLEAN,
        "responseId" TEXT,
        agent JSONB,
        persona JSONB,
        type TEXT
      )
    WHERE scenario_id = ${scenario_id}
    AND components.id IS NOT NULL
    AND components."responseId" IS NOT NULL
    AND components.agent IS NOT NULL
  )
  SELECT
    c.id,
    c.slide_id,
    c.scenario_id,
    c.required,
    c.response_id,
    c.persona,
    c.type,
    JSONB_AGG(TO_JSONB(av))::json->0 AS agent
  FROM c
  JOIN agent_view av ON c.agent_id::INTEGER = av.id
  GROUP BY
    c.id,
    c.slide_id,
    c.scenario_id,
    c.required,
    c.response_id,
    c.persona,
    c.type;
  `);
  return result.rows;
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
exports.getAgentResponses = getAgentResponses;
exports.getAgents = getAgents;
exports.getScenarioAgentPrompts = getScenarioAgentPrompts;
exports.insertNewAgentResponse = insertNewAgentResponse;
exports.setAgent = setAgent;
exports.setAgentSocketConfiguration = setAgentSocketConfiguration;
exports.setAgentConfiguration = setAgentConfiguration;
exports.setAgentInteraction = setAgentInteraction;
