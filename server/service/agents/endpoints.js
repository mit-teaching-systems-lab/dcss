const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const { getUserById } = require('../session/db');

async function createAgent(req, res) {
  const owner = {
    id: req.session.user.id
  };

  if (!req.body.title || !req.body.description || !req.body.interaction) {
    const error = new Error(
      'Creating an agent requires a title, description and interaction.'
    );
    error.status = 500;
    throw error;
  }

  const agent = await db.createAgent({
    ...req.body,
    owner
  });
  res.json({ agent });
}

async function getAgent(req, res) {
  const agent = await db.getAgent(Number(req.params.id));
  res.json({ agent });
}

async function getAgentResponses(req, res) {
  const agent_id = Number(req.params.id);
  const run_id = Number(req.params.run_id);
  const user_id = Number(req.params.user_id);

  if (user_id !== req.session.user.id) {
    return res.json({ responses: [] });
  }

  const responses = await db.getAgentResponses(agent_id, run_id, user_id);
  res.json({ responses });
}

async function getInteractions(req, res) {
  const interactions = await db.getInteractions();
  res.json({ interactions });
}

async function getAgents(req, res) {
  const is_active = req.url.endsWith('is_active');
  let where = {};

  if (is_active) {
    where = {
      is_active
    };
  }

  const agents = await db.getAgents(where);
  res.json({ agents });
}

async function setAgent(req, res) {
  const id = Number(req.params.id);
  const {
    title,
    name,
    description,
    deleted_at,
    endpoint,
    interaction,
    configuration,
    socket
  } = req.body;

  const updates = {};

  if (title) {
    updates.title = title;
  }

  if (name) {
    updates.name = name;
  }

  if (description) {
    updates.description = description;
  }

  if (endpoint) {
    updates.endpoint = endpoint;
  }

  // When restoring a agent, deleted_at will be set to null.
  if (deleted_at !== undefined) {
    updates.deleted_at = deleted_at;
  }

  if (Object.entries(updates).length) {
    try {
      await db.setAgent(id, updates);
    } catch ({ message }) {
      const error = new Error(`Agent could not be updated. ${message}`);
      error.status = 500;
      throw error;
    }
  }

  if (interaction) {
    try {
      await db.setAgentInteraction(id, interaction);
    } catch ({ message }) {
      const error = new Error(`Agent interaction could not be set. ${message}`);
      error.status = 500;
      throw error;
    }
  }

  if (socket) {
    try {
      await db.setAgentSocketConfiguration(id, socket);
    } catch ({ message }) {
      const error = new Error(
        `Agent socket configuration could not be set. ${message}`
      );
      error.status = 500;
      throw error;
    }
  }

  if (configuration) {
    try {
      await db.setAgentConfiguration(id, configuration);
    } catch ({ message }) {
      const error = new Error(
        `Agent configuration could not be set. ${message}`
      );
      error.status = 500;
      throw error;
    }
  }

  const agent = await db.getAgent(id);

  res.json({ agent });
}

exports.createAgent = asyncMiddleware(createAgent);
exports.getAgent = asyncMiddleware(getAgent);
exports.getAgentResponses = asyncMiddleware(getAgentResponses);
exports.getAgents = asyncMiddleware(getAgents);
exports.getInteractions = asyncMiddleware(getInteractions);
exports.setAgent = asyncMiddleware(setAgent);
