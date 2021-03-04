const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const { getUserById } = require('../session/db');

async function createInteraction(req, res) {
  const owner = {
    id: req.session.user.id
  };

  if (!req.body.name || !req.body.description || !req.body.types.length) {
    const error = new Error(
      'Creating an interaction requires a name, description and list of prompts.'
    );
    error.status = 500;
    throw error;
  }

  const interaction = await db.createInteraction({
    ...req.body,
    owner
  });

  res.json({ interaction });
}

async function getInteraction(req, res) {
  const interaction = await db.getInteraction(Number(req.params.id));
  res.json({ interaction });
}

async function getInteractions(req, res) {
  const interactions = await db.getInteractions();
  res.json({ interactions });
}

async function getInteractionsTypes(req, res) {
  const types = await db.getInteractionsTypes();
  res.json({ types });
}

async function setInteraction(req, res) {
  const id = Number(req.params.id);
  const { title, name, description, deleted_at } = req.body;

  const updates = {};

  if (name) {
    updates.name = name;
  }

  if (description) {
    updates.description = description;
  }

  // When restoring a interaction, deleted_at will be set to null.
  if (deleted_at !== undefined) {
    updates.deleted_at = deleted_at;
  }

  if (Object.entries(updates).length) {
    try {
      await db.setInteraction(id, updates);
    } catch ({ message }) {
      const error = new Error(`Interaction could not be updated. ${message}`);
      error.status = 500;
      throw error;
    }
  }

  const interaction = await db.getInteraction(id);

  res.json({ interaction });
}

exports.createInteraction = asyncMiddleware(createInteraction);
exports.getInteraction = asyncMiddleware(getInteraction);
exports.getInteractions = asyncMiddleware(getInteractions);
exports.getInteractionsTypes = asyncMiddleware(getInteractionsTypes);
exports.setInteraction = asyncMiddleware(setInteraction);
