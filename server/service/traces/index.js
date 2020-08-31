const { Router } = require('express');
const { validateRequestBody } = require('../../util/requestValidation');
const { requireUser } = require('../auth/middleware');
const { requireUserForRun } = require('./middleware');
const {
  getTraces
} = require('./endpoints');

const traces = new Router();

traces.get('/user/:user_id', [requireUser, getTraces]);
traces.get('/cohort/:cohort_id/scenario/:scenario_id', [requireUser, getTraces]);
traces.get('/cohort/:cohort_id', [requireUser, getTraces]);
traces.get('/scenario/:scenario_id', [requireUser, getTraces]);
traces.get('', [requireUser, getTraces]);

module.exports = traces;





/*


/traces/
  - All available traces

/traces/scenario/:scenario_id
  - Traces for this scenario

/traces/cohort/:cohort_id
  - Traces for this cohort

/traces/cohort/:cohort_id/scenario/:scenario_id
  - Traces for this scenario, in this cohort

/traces/user/:user_id
  - Traces for this user


 */
