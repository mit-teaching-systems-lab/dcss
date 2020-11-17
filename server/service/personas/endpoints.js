const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

async function getPersonasAsync(req, res) {
  const personas = await db.getPersonas();
  res.json({ personas });
}

async function getPersonasByUserIdAsync(req, res) {
  const personas = await db.getPersonasByUserId(req.session.user.id);
  res.json({ personas });
}

async function getPersonasByScenarioIdAsync(req, res) {
  const id = Number(req.params.id);
  const personas = await db.getPersonasByScenarioId(id);
  res.json({ personas });
}

async function createPersonaAsync(req, res) {
  const author_id = req.session.user.id;
  const {
    name, color, description, scenario_id
  } = req.body;

  if (!author_id || !name || !color || !description) {
    const error = new Error('Creating a persona requires a user id, name, color and description.');
    error.status = 422;
    throw error;
  }

  const persona = await db.createPersona({
    name,
    description,
    color,
    scenario_id,
    author_id
  });

  if (!persona) {
    const error = new Error('Persona could not be created.');
    error.status = 409;
    throw error;
  }

  res.json({ persona });
}

async function linkPersonaToScenarioAsync(req, res) {
  const id = Number(req.params.id);
  const scenario_id = Number(req.params.scenario_id);
  const link = await db.linkPersonaToScenario(id, scenario_id);

  if (!link) {
    throw new Error(
      'Persona could not be linked to scenario.'
    );
  }

  const personas = await db.getPersonasByScenarioId(scenario_id);

  res.json({ personas });
}

async function getPersonaByIdAsync(req, res) {
  const id = Number(req.params.id);
  const persona = await db.getPersonaById(id);
  res.json({ persona });
}

async function setPersonaByIdAsync(req, res) {
  const id = Number(req.params.id);
  const {
    color = null,
    deleted_at = null,
    description = null,
    name = null,
  } = req.body;

  const updates = {};

  if (color) {
    updates.color = color;
  }

  if (deleted_at) {
    updates.deleted_at = deleted_at;
  }

  if (description) {
    updates.description = description;
  }

  if (name) {
    updates.name = name;
  }

  let persona;

  if (Object.entries(updates).length) {
    persona = await db.setPersonaById(id, updates);
  } else {
    persona = await db.getPersonaById(id);
  }

  res.json({ persona });
}

exports.getPersonas = asyncMiddleware(getPersonasAsync);
exports.getPersonasByUserId = asyncMiddleware(getPersonasByUserIdAsync);
exports.getPersonasByScenarioId = asyncMiddleware(getPersonasByScenarioIdAsync);
exports.createPersona = asyncMiddleware(createPersonaAsync);
exports.getPersonaById = asyncMiddleware(getPersonaByIdAsync);
exports.setPersonaById = asyncMiddleware(setPersonaByIdAsync);
exports.linkPersonaToScenario = asyncMiddleware(linkPersonaToScenarioAsync);
