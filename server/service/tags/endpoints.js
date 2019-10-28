const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

exports.getCategories = asyncMiddleware(async function getCategories(req, res) {
    res.json(await db.getCategories());
});

exports.getTopics = asyncMiddleware(async function getTopics(req, res) {
    res.json(await db.getTopics());
});
