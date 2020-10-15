const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

async function getComponentsAsync(req, res) {
  const components = await db.getComponentsByUserId(req.session.user.id);
  res.json({ components });
}

async function getComponentsByUserIdAsync(req, res) {
  const components = await db.getComponentsByUserId(req.params.user_id);
  res.json({ components });
}

async function getComponentsByScenarioIdAsync(req, res) {
  const components = await db.getComponentsByScenarioId(req.params.scenario_id);
  res.json({ components });
}

exports.getComponents = asyncMiddleware(getComponentsAsync);
exports.getComponentsByUserId = asyncMiddleware(getComponentsByUserIdAsync);
exports.getComponentsByScenarioId = asyncMiddleware(
  getComponentsByScenarioIdAsync
);
