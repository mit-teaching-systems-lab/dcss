const { Router } = require('express');
const { validateRequestBody } = require('../../util/requestValidation');
const { requireUser } = require('../auth/middleware');
const { requireUserForRun } = require('./middleware');
const { createRun, postResponseData, finishRun } = require('./endpoints');

const runs = new Router();

runs.put('/create/scenario/:scenario_id', requireUser, createRun);
runs.post(
    '/:run_id/response/:response_id',
    requireUserForRun,
    validateRequestBody,
    postResponseData
);

runs.put('/:run_id/finish', requireUserForRun, finishRun);

module.exports = runs;
