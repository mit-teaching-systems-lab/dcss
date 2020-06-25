const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

exports.getCategories = asyncMiddleware(async function getCategories(req, res) {
  const categories = await db.getCategories();
  res.json({ categories });
});

exports.getTopics = asyncMiddleware(async function getTopics(req, res) {
  const topics = await db.getTopics();
  res.json({ topics });
});
