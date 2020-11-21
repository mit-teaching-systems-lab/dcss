const { Router } = require('express');
const { requireUser } = require('../auth/middleware');
const {
  getCategories,
  getTopics,
  getLabels,
  getTags,
  createTag
} = require('./endpoints');

const tags = new Router();

tags.get('/', [requireUser, getTags]);
tags.post('/', [requireUser, createTag]);

tags.get('/categories', [requireUser, getCategories]);
tags.get('/topics', [requireUser, getTopics]);
tags.get('/labels', [requireUser, getLabels]);

module.exports = tags;
