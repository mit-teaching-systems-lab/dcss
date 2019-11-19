const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');
const { requireUser } = require('../auth/middleware');
const router = Router();

const { createCohort, listUserCohorts } = require('./endpoints');

router.put('/', [requireUser, validateRequestBody, createCohort]);
router.get('/', [requireUser, listUserCohorts]);
// router.get('/:cohort_id', [requireUser, getCohort]);

module.exports = router;
