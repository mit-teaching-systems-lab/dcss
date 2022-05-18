const { Router } = require('express');
const { requireUserRole } = require('../roles/middleware');
const { validateRequestBody } = require('../../util/requestValidation');
const { lookupScenario, requireScenarioUserRole } = require('./middleware');

const requiredRoles = ['super_admin', 'admin', 'facilitator'];
const router = Router();

const {
  createScenario,
  copyScenario,
  deleteScenario,
  createScenarioLock,
  endScenarioLock,
  getScenarios,
  getScenariosByStatus,
  getScenariosCount,
  getScenariosSlice,
  getRecentScenarios,
  getScenario,
  getScenarioByRun,
  setScenario,
  softDeleteScenario,
  setScenarioUserRole,
  endScenarioUserRole,
  getExampleScenarios
} = require('./endpoints.js');

router.get('/', getScenarios);
router.get('/count', getScenariosCount);
router.get('/status/:status', getScenariosByStatus);
router.get('/slice/:direction/:offset/:limit', getScenariosSlice);
router.get('/recent/:orderBy/:limit', getRecentScenarios);
router.get('/examples', getExampleScenarios);

router.get('/run', getScenarioByRun);
router.get('/:scenario_id', [lookupScenario(), getScenario]);

router.get('/:scenario_id/lock', [
  requireUserRole(requiredRoles),
  requireScenarioUserRole(['owner', 'author', 'reviewer']),
  createScenarioLock
]);

router.get('/:scenario_id/unlock', [
  requireUserRole(requiredRoles),
  requireScenarioUserRole(['owner', 'author', 'reviewer']),
  endScenarioLock
]);

router.post('/', [
  requireUserRole(requiredRoles),
  validateRequestBody,
  createScenario
]);

router.put('/:scenario_id', [
  requireUserRole(requiredRoles),
  requireScenarioUserRole(['owner', 'author', 'reviewer']),
  lookupScenario(),
  validateRequestBody,
  setScenario
]);

router.get('/:scenario_id/copy', [
  requireUserRole(requiredRoles),
  lookupScenario(),
  copyScenario
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
  setScenarioUserRole
]);

router.post('/:scenario_id/roles/end', [
  requireScenarioUserRole(['owner']),
  validateRequestBody,
  endScenarioUserRole
]);

module.exports = router;
