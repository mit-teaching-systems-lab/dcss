const { Router } = require('express');
const {
  // Use for restricting access to only authed users.
  requireUser
} = require('../session/middleware');
const { validateRequestBody } = require('../../util/requestValidation');
const { sendMailMessageAndRespond } = require('./endpoints');

const router = Router();

router.post('/send', [
  requireUser,
  validateRequestBody,
  sendMailMessageAndRespond
]);

module.exports = router;
