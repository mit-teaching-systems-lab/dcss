const { Router } = require('express');
const router = Router();
const {
  // Use for restricting access to only authed users.
  requireUser
} = require('../session/middleware');
const { validateRequestBody } = require('../../util/requestValidation');
const {
  createChat,
  createChatInvite,
  getChatById,
  getChatMessagesByChatId,
  getChatMessagesCountByChatId,
  getChats,
  getChatsByUserId,
  getChatsByCohortId,
  getChatUsersByChatId,
  getLinkedChatUsersByChatId,
  getMessageById,
  joinChat,
  linkRunToChat,
  newOrExistingChat,
  setChatById,
  // setChatInviteById,
  setMessageById
} = require('./endpoints');

router.get('/', [requireUser, getChats]);
router.post('/', [requireUser, newOrExistingChat]);

router.get('/new-or-existing/scenario/:scenario_id', [
  requireUser,
  newOrExistingChat
]);

router.get('/new-or-existing/scenario/:scenario_id/cohort/:cohort_id', [
  requireUser,
  newOrExistingChat
]);

router.get('/my', [requireUser, getChatsByUserId]);

router.get('/user/:id', [requireUser, getChatsByUserId]);
router.get('/cohort/:id', [requireUser, getChatsByCohortId]);

router.post('/:id/invite', [requireUser, createChatInvite]);
router.post('/:id/join', [requireUser, joinChat]);

router.get('/:id/messages/count', [requireUser, getChatMessagesCountByChatId]);
router.get('/:id/messages', [requireUser, getChatMessagesByChatId]);
router.get('/:id/users/linked', [requireUser, getLinkedChatUsersByChatId]);
router.get('/:id/users', [requireUser, getChatUsersByChatId]);
router.get('/:id', [requireUser, getChatById]);
router.put('/:id', [requireUser, validateRequestBody, setChatById]);

router.get('/link/:id/run/:run_id', [requireUser, linkRunToChat]);

router.get('/messages/:id', [requireUser, getMessageById]);
router.put('/messages/:id', [requireUser, validateRequestBody, setMessageById]);

module.exports = router;
