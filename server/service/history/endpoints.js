const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

async function getHistoryForScenarioAsync(req, res) {
  const history = await db.getHistoryForScenario(req);
  res.send({ history });
}

exports.getHistoryForScenario = asyncMiddleware(getHistoryForScenarioAsync);
