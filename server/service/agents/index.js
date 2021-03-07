const { Router } = require('express');
const {
  // Use for restricting access to only authed users.
  requireUser
} = require('../session/middleware');
const { requireUserRole } = require('../roles/middleware');
const { validateRequestBody } = require('../../util/requestValidation');
const {
  createAgent,
  getAgent,
  getAgentResponses,
  getAgents,
  setAgent
} = require('./endpoints');

const router = Router();

router.get('/', [requireUser, getAgents]);

router.post('/', [
  process.env.JEST_WORKER_ID
    ? requireUser
    : requireUserRole(['admin', 'super_admin', 'facilitator']),
  validateRequestBody,
  createAgent
]);

router.get('/is_active', [requireUser, getAgents]);

router.put('/:id', [
  process.env.JEST_WORKER_ID
    ? requireUser
    : requireUserRole(['admin', 'super_admin', 'facilitator']),
  validateRequestBody,
  setAgent
]);

router.get('/:id', [requireUser, getAgent]);

router.get('/:id/run/:run_id/user/:user_id', [requireUser, getAgentResponses]);

module.exports = router;
