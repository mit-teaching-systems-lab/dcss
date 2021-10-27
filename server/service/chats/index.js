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
  getChatInvites,
  getChat,
  getChatMessagesByChatId,
  getChatMessagesCountByChatId,
  getChats,
  getChatsByUserId,
  getChatsByCohortId,
  getChatTranscriptsByAssociationId,
  getChatUsersByChatId,
  getChatUsersSharedResponses,
  getLinkedChatUsersByChatId,
  getMessageById,
  joinChat,
  linkRunToChat,
  newOrExistingChat,
  setChat,
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

router.get('/:id/response/:response_id/', [
  requireUser,
  getChatUsersSharedResponses
]);
router.get('/:id/invites', [requireUser, getChatInvites]);
router.get('/:id/messages/count', [requireUser, getChatMessagesCountByChatId]);
router.get('/:id/messages', [requireUser, getChatMessagesByChatId]);
router.get('/:id/users/linked', [requireUser, getLinkedChatUsersByChatId]);
router.get('/:id/users', [requireUser, getChatUsersByChatId]);
router.get('/:id', [requireUser, getChat]);
router.put('/:id', [requireUser, validateRequestBody, setChat]);

router.get('/link/:id/run/:run_id', [requireUser, linkRunToChat]);

router.get('/messages/:id', [requireUser, getMessageById]);
router.put('/messages/:id', [requireUser, validateRequestBody, setMessageById]);

router.get('/transcripts/:association/:id', [
  requireUser,
  getChatTranscriptsByAssociationId
]);

module.exports = router;
