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
  getCohort,
  getAllCohorts,
  getMyCohorts,
  getCohortData,
  getCohortParticipantData,
  listUserCohorts,
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

router.put('/', [
  requireUser,
  requireUserRole(requiredSiteRoles),
  validateRequestBody,
  createCohort
]);

// TODO: determine whether this is in use.
router.get('/', [requireUser, listUserCohorts]);

router.post('/:id', [
  requireUser,
  requireUserRole(requiredSiteRoles),
  validateRequestBody,
  // requireCohortUserRole(requiredCohortRoles),
  setCohort
]);
router.post('/:id/scenarios', [
  requireUser,
  requireUserRole(requiredSiteRoles),
  validateRequestBody,
  // requireCohortUserRole(requiredCohortRoles),
  setCohortScenarios
]);
router.get('/my', [requireUser, getMyCohorts]);
router.get('/all', [requireUser, getAllCohorts]);
router.get('/:id', [requireUser, getCohort]);
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

// These are used for ACCESS CONTROL of other users.
router.post('/:id/roles/add', [
  requireUser,
  requireCohortUserRole(requiredCohortRoles),
  validateRequestBody,
  addCohortUserRole
]);
router.post('/:id/roles/delete', [
  requireUser,
  requireCohortUserRole(requiredCohortRoles),
  validateRequestBody,
  deleteCohortUserRole
]);

module.exports = router;
