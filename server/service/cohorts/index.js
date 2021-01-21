const { Router } = require('express');
const { validateRequestBody } = require('../../util/requestValidation');
const {
  // Use for restricting access to only authed users.
  requireUser
} = require('../auth/middleware');
const {
  // Use for restricting access to site-wide interactions
  requireUserRole
} = require('../roles/middleware');
const {
  // Use for restricting access to cohort-specific interactions
  requireCohortUserRole
} = require('./middleware');

const {
  // Use for linking a run to a cohort
  requireUserForRun
} = require('../runs/middleware');

const router = Router();

const {
  createCohort,
  copyCohort,
  getCohort,
  getCohortScenarios,
  getCohorts,
  getCohortsCount,
  getCohortsSlice,
  getCohortData,
  getCohortParticipantData,
  setCohort,
  setCohortScenarios,
  linkCohortToRun,
  joinCohort,
  quitCohort,
  doneCohort,
  addCohortUserRole,
  deleteCohortUserRole
} = require('./endpoints');

const requiredSiteRoles = ['super_admin', 'admin', 'researcher', 'facilitator'];
const requiredCohortRoles = ['owner', 'facilitator'];

router.post('/', [
  requireUser,
  requireUserRole(requiredSiteRoles),
  validateRequestBody,
  createCohort
]);

router.get('/', [requireUser, getCohorts]);
router.get('/count', [requireUser, getCohortsCount]);
router.get('/slice/:direction/:offset/:limit', [requireUser, getCohortsSlice]);

// These are used for ACCESS CONTROL of other users.
router.post('/:id/roles/delete', [
  requireUser,
  requireCohortUserRole(requiredCohortRoles),
  validateRequestBody,
  deleteCohortUserRole
]);
router.post('/:id/roles/add', [
  requireUser,
  requireCohortUserRole(requiredCohortRoles),
  validateRequestBody,
  addCohortUserRole
]);
router.get('/:id/scenarios', [requireUser, getCohortScenarios]);
router.put('/:id/scenarios', [
  requireUser,
  requireUserRole(requiredSiteRoles),
  // TODO: activate this step
  // requireCohortUserRole(requiredCohortRoles),
  validateRequestBody,
  setCohortScenarios
]);
router.put('/:id', [
  requireUser,
  requireUserRole(requiredSiteRoles),
  // TODO: activate this step
  // requireCohortUserRole(requiredCohortRoles),
  setCohort
]);
router.get('/:id/scenario/:scenario_id/:user_id', [requireUser, getCohortData]);
router.get('/:id/scenario/:scenario_id', [requireUser, getCohortData]);
router.get('/:id/participant/:participant_id', [
  requireUser,
  getCohortParticipantData
]);

router.get('/:id/run/:run_id', [
  requireUser,
  requireUserForRun,
  linkCohortToRun
]);

// These are used for interactions by the CURRENT USER
router.get('/:id/join/:role', [requireUser, joinCohort]);
router.get('/:id/quit', [requireUser, quitCohort]);
router.get('/:id/done', [requireUser, doneCohort]);
router.get('/:id/copy', [
  requireUser,
  requireCohortUserRole(requiredCohortRoles),
  copyCohort
]);
router.get('/:id', [requireUser, getCohort]);

module.exports = router;
