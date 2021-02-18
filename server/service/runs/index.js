const { Router } = require('express');
const { validateRequestBody } = require('../../util/requestValidation');
const { requireUser } = require('../session/middleware');
const { requireUserForRun } = require('./middleware');
const {
  getRuns,
  getResponse,
  getTranscriptionOutcome,
  getReferrerParams,
  getRunData,
  newOrExistingRun,
  revokeConsentForRun,
  saveRunEvent,
  setRun,
  upsertResponse
} = require('./endpoints');

const runs = new Router();

runs.get('/', [requireUser, getRuns]);

runs.get('/new-or-existing/scenario/:scenario_id', [
  requireUser,
  newOrExistingRun
]);

runs.get('/new-or-existing/scenario/:scenario_id/chat/:chat_id', [
  requireUser,
  newOrExistingRun
]);

runs.get('/new-or-existing/scenario/:scenario_id/cohort/:cohort_id', [
  requireUser,
  newOrExistingRun
]);

runs.get(
  '/new-or-existing/scenario/:scenario_id/cohort/:cohort_id/chat/:chat_id',
  [requireUser, newOrExistingRun]
);

runs.put('/:run_id', [
  requireUser,
  requireUserForRun,
  validateRequestBody,
  setRun
]);

runs.get('/:run_id', [requireUser, getRunData]);

runs.get('/:run_id/consent/revoke', [
  requireUser,
  requireUserForRun,
  revokeConsentForRun
]);

runs.post('/:run_id/event/:name', [
  requireUser,
  requireUserForRun,
  // validateRequestBody,
  saveRunEvent
]);

runs.post('/:run_id/response/:response_id', [
  requireUser,
  requireUserForRun,
  validateRequestBody,
  upsertResponse
]);

runs.get('/:run_id/response/:response_id/transcript', [
  requireUser,
  requireUserForRun,
  getTranscriptionOutcome
]);

runs.get('/:run_id/response/:response_id', [
  requireUser,
  requireUserForRun,
  getResponse
]);

runs.get('/:run_id/referrer-params', [
  requireUser,
  requireUserForRun,
  getReferrerParams
]);

module.exports = runs;
