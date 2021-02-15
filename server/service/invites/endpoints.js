const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

async function getInvites(req, res) {
  const invites = await db.getInvites(req.session.user.id);
  res.json({ invites });
}

// TODO: determine if these are necessary, if not remove.
async function getInvitesAsReceiver(req, res) {
  const invites = await db.getInvitesAsReceiver(req.session.user.id);
  res.json({ invites });
}

async function getInvitesAsSender(req, res) {
  const invites = await db.getInvitesAsSender(req.session.user.id);
  res.json({ invites });
}

const inviteStatus = {
  '1': 'pending',
  '2': 'canceled',
  '3': 'declined',
  '4': 'accepted',
};

async function setInvite(req, res) {
  const id = Number(req.params.id);
  let cached = db.cache.get(id, req.session.user.id);
  if (!cached) {
    cached = await db.getInvitesForUser(req.session.user.id);

    if (!cached) {
      const error = new Error('User is not allowed to change this invite.');
      error.status = 401;
      throw error;
    }
  } else {
    const { status } = req.body;
    const updates = {};

    if (status &&
        inviteStatus[status] &&
        inviteStatus[status] !== cached.status) {
      updates.status_id = status;
    }

    const result = await db.setInvite(id, updates);

    if (result.rowCount) {
      const error = new Error('Error while updating invites.');
      error.status = 500;
      throw error;
    }
  }

  const invites = await db.getInvites(req.session.user.id);

  res.json({ invites });
}

exports.getInvites = asyncMiddleware(getInvites);
exports.setInvite = asyncMiddleware(setInvite);
