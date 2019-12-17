const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');
const { requireUser } = require('../auth/middleware');
const { requireUserForRun } = require('../runs/middleware');
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
    doneCohort
} = require('./endpoints');

router.put('/', [requireUser, validateRequestBody, createCohort]);
router.get('/', [requireUser, listUserCohorts]);
router.post('/:id', [requireUser, validateRequestBody, setCohort]);
router.post('/:id/scenarios', [
    requireUser,
    validateRequestBody,
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

// /api/cohort/${id}/run/${runId}
router.get('/:id/run/:run_id', [requireUserForRun, linkCohortToRun]);

router.get('/:id/join/:role', [requireUser, joinCohort]);
router.get('/:id/quit', [requireUser, quitCohort]);
router.get('/:id/done', [requireUser, doneCohort]);

module.exports = router;
