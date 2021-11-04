const { Router } = require('express');
const { getPartnering } = require('./endpoints');

const partnering = new Router();

partnering.get('/', [getPartnering]);

module.exports = partnering;
