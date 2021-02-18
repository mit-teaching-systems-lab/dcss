const { Router } = require('express');
const router = Router();
const {
  // Use for restricting access to only authed users.
  requireUser
} = require('../session/middleware');
const { validateRequestBody } = require('../../util/requestValidation');
const { requireUserRole } = require('../roles/middleware');
const {
  createNotification,
  getNotificationById,
  setNotificationById,
  deleteNotificationById,
  setNotificationAck,
  getNotifications,
  getNotificationsByAuthorId,
  getNotificationsStartedNotExpired
} = require('./endpoints');

router.get('/', [requireUser, getNotifications]);

router.post('/', [requireUser, validateRequestBody, createNotification]);

router.get('/author/:id', [requireUser, getNotificationsByAuthorId]);

router.get('/:id', [requireUser, getNotificationById]);

router.put('/:id', [
  requireUser,
  requireUserRole(['admin', 'super_admin', 'facilitator']),
  validateRequestBody,
  setNotificationById
]);

router.post('/ack', [requireUser, setNotificationAck]);

router.get('/:start_at/:expire_at', [
  requireUser,
  getNotificationsStartedNotExpired
]);

module.exports = router;
