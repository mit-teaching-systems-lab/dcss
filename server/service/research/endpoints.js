const db = require('./db');
const { asyncMiddleware } = require('../../util/api');
// const { getUserById } = require('../session/db');

async function getAllCohortGrantsAsync(req, res) {
  const { user } = req.session;
  const cohorts = await db.getAllCohortGrants(user);

  if (!cohorts) {
    const error = new Error('No cohorts found');
    error.status = 409;
    throw error;
  }

  res.json({ cohorts });
}

exports.getAllCohortGrants = asyncMiddleware(getAllCohortGrantsAsync);
