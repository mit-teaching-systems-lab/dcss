const { Router } = require('express');
const router = Router();
const {
  // Use for restricting access to only authed users.
  requireUser
} = require('../session/middleware');
const {
  getInvites,
  setInvite
} = require('./endpoints');

router.get('/', [requireUser, getInvites]);
router.put('/:id', [requireUser, setInvite]);

module.exports = router;
