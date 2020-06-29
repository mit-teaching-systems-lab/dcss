const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

async function getHistoryForScenarioAsync(req, res) {
  const history = await db.getHistoryForScenario(req.params);
  res.send({ history, status: 200 });
}

exports.getHistoryForScenario = asyncMiddleware(getHistoryForScenarioAsync);
