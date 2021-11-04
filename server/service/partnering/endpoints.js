const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

let cached = [];

async function getPartnering(req, res) {
  let partnering = cached;

  if (partnering.length) {
    return res.json({ partnering });
  }

  partnering = await db.getPartnering();

  res.json({ partnering });
  // eslint-disable-next-line require-atomic-updates
  cached = partnering;
}

exports.getPartnering = asyncMiddleware(getPartnering);
