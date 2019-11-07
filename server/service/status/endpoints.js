const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

async function getStatusOptions(req, res) {
    res.json(await db.getStatusOptions());
}
exports.getStatusOptions = asyncMiddleware(getStatusOptions);
