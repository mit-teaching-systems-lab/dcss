const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');
const { requireUser } = require('../auth/middleware');
const router = Router();

const {
    createCohort,
    getCohort,
    getCohorts,
    listUserCohorts,
    setCohort,
    setCohortScenarios,
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
router.get('/my', [requireUser, getCohorts]);
router.get('/:id', [requireUser, getCohort]);

router.get('/:id/join/:role', [requireUser, joinCohort]);
router.get('/:id/quit', [requireUser, quitCohort]);
router.get('/:id/done', [requireUser, doneCohort]);

module.exports = router;
