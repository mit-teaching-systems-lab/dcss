const { Router } = require('express');
const { requireUser } = require('../session/middleware');
const router = Router();

const { getHistoryForScenario } = require('./endpoints.js');

router.get('/:scenario_id', [requireUser, getHistoryForScenario]);
router.get('/:scenario_id/cohort/:cohort_id', [
  requireUser,
  getHistoryForScenario
]);

module.exports = router;
