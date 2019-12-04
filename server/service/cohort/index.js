const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');
const { requireUser } = require('../auth/middleware');
const router = Router();

const {
    getCohort,
    getCohorts,
    setCohort,
    setCohortScenarios,
    createCohort,
    listUserCohorts
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

module.exports = router;
