const { Router } = require('express');
const router = Router();
const {
  // Use for restricting access to only authed users.
  requireUser
} = require('../session/middleware');
const {
  getInvites,
  // getInvitesAsReceiver,
  // getInvitesAsSender,
  setInvite
} = require('./endpoints');

router.get('/', [requireUser, getInvites]);
// router.get('/receiver', [requireUser, getInvitesAsReceiver]);
// router.get('/sender', [requireUser, getInvitesAsSender]);

router.put('/:id', [requireUser, setInvite]);

module.exports = router;
