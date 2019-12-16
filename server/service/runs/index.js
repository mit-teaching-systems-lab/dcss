const { Router } = require('express');
const { validateRequestBody } = require('../../util/requestValidation');
const { requireUser } = require('../auth/middleware');
const { requireUserForRun } = require('./middleware');
const {
    finishRun,
    getUserRuns,
    getResponse,
    getReferrerParams,
    getRunData,
    newOrExistingRun,
    revokeConsentForRun,
    updateRun,
    upsertResponse
} = require('./endpoints');

const runs = new Router();

runs.put('/new-or-existing/scenario/:scenario_id', [
    requireUser,
    newOrExistingRun
]);
runs.get('/', [requireUser, getUserRuns]);

runs.put('/:run_id/finish', [requireUserForRun, finishRun]);

runs.post('/:run_id/update', [
    requireUserForRun,
    validateRequestBody,
    updateRun
]);

runs.get('/:run_id', [requireUser, getRunData]);
runs.get('/:run_id/consent/revoke', [requireUserForRun, revokeConsentForRun]);

runs.post('/:run_id/response/:response_id', [
    requireUserForRun,
    validateRequestBody,
    upsertResponse
]);

runs.get('/:run_id/response/:response_id', [requireUserForRun, getResponse]);
runs.get('/:run_id/referrer-params', [requireUserForRun, getReferrerParams]);

module.exports = runs;
