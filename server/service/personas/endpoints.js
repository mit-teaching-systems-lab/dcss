const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

async function getPersonas(req, res) {
  const personas = await db.getPersonas();
  res.json({ personas });
}

async function getPersonasByUserId(req, res) {
  const personas = await db.getPersonasByUserId(req.session.user.id);
  res.json({ personas });
}

async function getPersonasByScenarioId(req, res) {
  const id = Number(req.params.id);
  const personas = await db.getPersonasByScenarioId(id);
  res.json({ personas });
}

async function createPersona(req, res) {
  const author_id = req.session.user.id;
  const { name, color, description, scenario_id } = req.body;

  if (!author_id || !name || !color || !description) {
    const error = new Error(
      'Creating a persona requires a user id, name, color and description.'
    );
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

async function linkPersonaToScenario(req, res) {
  const id = Number(req.params.id);
  const scenario_id = Number(req.params.scenario_id);

  await db.linkPersonaToScenario(id, scenario_id);
  const personas = await db.getPersonasByScenarioId(scenario_id);

  res.json({ personas });
}

async function unlinkPersonaFromScenario(req, res) {
  const id = Number(req.params.id);
  const scenario_id = Number(req.params.scenario_id);

  await db.unlinkPersonaFromScenario(id, scenario_id);
  const personas = await db.getPersonasByScenarioId(scenario_id);

  res.json({ personas });
}

async function getPersonaById(req, res) {
  const id = Number(req.params.id);
  const persona = await db.getPersonaById(id);
  res.json({ persona });
}

async function setPersonaById(req, res) {
  const id = Number(req.params.id);
  const {
    color = null,
    deleted_at = null,
    description = null,
    name = null
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

exports.getPersonas = asyncMiddleware(getPersonas);
exports.getPersonasByUserId = asyncMiddleware(getPersonasByUserId);
exports.getPersonasByScenarioId = asyncMiddleware(getPersonasByScenarioId);
exports.createPersona = asyncMiddleware(createPersona);
exports.getPersonaById = asyncMiddleware(getPersonaById);
exports.setPersonaById = asyncMiddleware(setPersonaById);
exports.linkPersonaToScenario = asyncMiddleware(linkPersonaToScenario);
exports.unlinkPersonaFromScenario = asyncMiddleware(unlinkPersonaFromScenario);
