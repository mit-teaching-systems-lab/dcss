const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const { getUserById } = require('../session/db');

async function createAgent(req, res) {
  const params = {
    ...req.body,
    owner_id
  };
  const agent = await db.createAgent(params);
  res.json({ agent });
}

async function getAgent(req, res) {
  const agent = await db.getAgent(Number(req.params.id));
  res.json({ agent });
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
    name,
    description,
    deleted_at,
    endpoint,
    interaction,
    configuration
  } = req.body;

  const updates = {
    updated_at: new Date().toISOString()
  };

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

  if (configuration) {
    try {
      await db.setAgentConfiguration(id, configuration);
    } catch ({ message }) {
      const error = new Error(`Agent configuration could not be set. ${message}`);
      error.status = 500;
      throw error;
    }
  }

  const agent = await db.getAgent(id);

  res.json({ agent });
}

exports.createAgent = asyncMiddleware(createAgent);
exports.getAgent = asyncMiddleware(getAgent);
exports.getAgents = asyncMiddleware(getAgents);
exports.setAgent = asyncMiddleware(setAgent);
