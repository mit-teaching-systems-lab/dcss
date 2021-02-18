const { Router } = require('express');
const { requireUser } = require('../session/middleware');
const {
  getCategories,
  getTopics,
  getLabels,
  getLabelsByOccurrence,
  getTags,
  createTag
} = require('./endpoints');

const tags = new Router();

tags.get('/', [requireUser, getTags]);
tags.post('/', [requireUser, createTag]);

tags.get('/categories', [requireUser, getCategories]);
tags.get('/topics', [requireUser, getTopics]);
tags.get('/labels', [requireUser, getLabels]);
tags.get('/labels/occurrence/:direction', [requireUser, getLabelsByOccurrence]);

module.exports = tags;
