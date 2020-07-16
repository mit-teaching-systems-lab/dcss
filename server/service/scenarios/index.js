const { Router } = require('express');
const { requireUserRole } = require('../roles/middleware');
const { validateRequestBody } = require('../../util/requestValidation');
const { lookupScenario, requireScenarioUserRole } = require('./middleware');

const requiredRoles = ['super_admin', 'admin', 'facilitator'];
const router = Router();

const {
  addScenario,
  copyScenario,
  deleteScenario,
  unlockScenario,
  getAllScenarios,
  getScenario,
  getScenarioByRun,
  setScenario,
  softDeleteScenario,
  addScenarioUserRole,
  endScenarioUserRole
} = require('./endpoints.js');

router.get('/', getAllScenarios);
router.get('/run', getScenarioByRun);
router.get('/:scenario_id', [lookupScenario(), getScenario]);

router.put('/', [
  requireUserRole(requiredRoles),
  validateRequestBody,
  addScenario
]);

router.post('/:scenario_id', [
  requireUserRole(requiredRoles),
  requireScenarioUserRole(['owner', 'author']),
  lookupScenario(),
  validateRequestBody,
  setScenario
]);

router.post('/:scenario_id/unlock', [
  requireUserRole(requiredRoles),
  requireScenarioUserRole(['owner', 'author']),
  lookupScenario(),
  validateRequestBody,
  unlockScenario
]);

router.post('/:scenario_id/copy', [
  requireUserRole(requiredRoles),
  lookupScenario(),
  copyScenario
]);

router.delete('/:scenario_id', [
  requireUserRole(requiredRoles),
  requireScenarioUserRole(['owner']),
  lookupScenario(),
  softDeleteScenario
]);

router.delete('/:scenario_id/hard', [
  requireUserRole(['super_admin', 'admin']),
  lookupScenario(),
  deleteScenario
]);

router.use('/:scenario_id/slides', [lookupScenario(), require('./slides')]);

// SCENARIO AUTHORING ACCESS CONTROL
router.post('/:scenario_id/roles/add', [
  requireScenarioUserRole(['owner']),
  validateRequestBody,
  addScenarioUserRole
]);

router.post('/:scenario_id/roles/end', [
  requireScenarioUserRole(['owner']),
  validateRequestBody,
  endScenarioUserRole
]);

module.exports = router;
