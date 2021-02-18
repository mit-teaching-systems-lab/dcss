const { Router } = require('express');
const { requireUser } = require('../session/middleware');
const { getStatusOptions } = require('./endpoints');

const router = new Router();

router.get('/', requireUser, getStatusOptions);

module.exports = router;
