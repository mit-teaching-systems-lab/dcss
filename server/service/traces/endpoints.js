const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const { runForRequest } = require('./middleware');


/*

  getTraces
  getTracesByCohortId
  getTracesByCohortIdAndScenarioId
  getTracesByRunId
  getTracesByScenarioId
  getTracesByUserId

*/
async function getTracesAsync(req, res) {
  const {
    params
  } = req;

  const noParams = Object.entries(params).length === 0;
  let events = [];

  if (noParams) {
    events = await db.getTraces();

  } else {

    const {
      cohort_id,
      run_id,
      scenario_id,
      user_id
    } = params;

    if (cohort_id && scenario_id) {
      events = await db.getTracesByCohortIdAndScenarioId(cohort_id, scenario_id);
    }

    if (cohort_id && !scenario_id) {
      events = await db.getTracesByCohortId(cohort_id);
    }

    if (!cohort_id && scenario_id) {
      events = await db.getTracesByScenarioId(scenario_id);
    }

    if (run_id) {
      events = await db.getTracesByRunId(run_id);
    }

    if (user_id) {
      events = await db.getTracesByUserId(user_id);
    }
  }

  const traces = events.reduce((accum, event) => {
    if (!accum[event.run_id]) {
      accum[event.run_id] = [];
    }
    accum[event.run_id].push(event);
    return accum;
  }, {});

  res.json({ status: 200, traces });
}

exports.getTraces = asyncMiddleware(getTracesAsync);
