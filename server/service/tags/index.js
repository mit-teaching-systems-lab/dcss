const { Router } = require('express');
const { requireUser } = require('../auth/middleware');
const { getCategories, getTopics } = require('./endpoints');

const tags = new Router();

tags.get('/categories', requireUser, getCategories);
tags.get('/topics', requireUser, getTopics);

module.exports = tags;
