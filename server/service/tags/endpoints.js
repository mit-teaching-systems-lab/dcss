const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

async function getCategories(req, res) {
  const categories = await db.getCategories();
  res.json({ categories });
}

async function getTopics(req, res) {
  const topics = await db.getTopics();
  res.json({ topics });
}

async function getLabels(req, res) {
  const labels = await db.getLabels();
  res.json({ labels });
}

async function getTags(req, res) {
  const tags = await db.getTags();
  res.json({ tags });
}

async function createTag(req, res) {
  const { name, tag_type_id } = req.body;

  const tag = await db.createTag(name, tag_type_id);
  res.json({ tag });
}

exports.getCategories = asyncMiddleware(getCategories);
exports.getTags = asyncMiddleware(getTags);
exports.getTopics = asyncMiddleware(getTopics);
exports.getLabels = asyncMiddleware(getLabels);
exports.createTag = asyncMiddleware(createTag);
