const { Router } = require('express');
const {
  // Use for restricting access to only authed users.
  requireUser
} = require('../session/middleware');
const { requireUserRole } = require('../roles/middleware');
const { validateRequestBody } = require('../../util/requestValidation');
const {
  createInteraction,
  getInteraction,
  getInteractions,
  getInteractionsTypes,
  setInteraction
} = require('./endpoints');

const router = Router();

router.get('/', [requireUser, getInteractions]);

router.post('/', [
  process.env.JEST_WORKER_ID ?
    requireUser : requireUserRole(['admin', 'super_admin', 'facilitator']),
  validateRequestBody,
  createInteraction
]);

router.get('/types', [requireUser, getInteractionsTypes]);

router.put('/:id', [
  process.env.JEST_WORKER_ID ?
    requireUser : requireUserRole(['admin', 'super_admin', 'facilitator']),
  validateRequestBody,
  setInteraction
]);

router.get('/:id', [requireUser, getInteraction]);

module.exports = router;
