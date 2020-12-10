const { Router } = require('express');
const router = Router();
const {
  // Use for restricting access to only authed users.
  requireUser
} = require('../auth/middleware');
const { validateRequestBody } = require('../../util/requestValidation');
const {
  createChat,
  getChats,
  getChatsByUserId,
  getChatMessagesByChatId,
  getChatMessagesCountByChatId,
  getChatUsersByChatId,
  getChatById,
  setChatById,
  linkChatToRun
} = require('./endpoints');

router.get('/', [requireUser, getChats]);

router.post('/', [requireUser, createChat]);

router.get('/my', [requireUser, getChatsByUserId]);

router.get('/user/:id', [requireUser, getChatsByUserId]);

router.get('/:id/messages/count', [requireUser, getChatMessagesCountByChatId]);
router.get('/:id/messages', [requireUser, getChatMessagesByChatId]);
router.get('/:id/users', [requireUser, getChatUsersByChatId]);
router.get('/:id', [requireUser, getChatById]);

router.put('/:id', [requireUser, validateRequestBody, setChatById]);

router.get('/link/:id/run/:run_id', [requireUser, linkChatToRun]);

module.exports = router;
