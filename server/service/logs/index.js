const { Router } = require('express');
const logs = new Router();
const { getLogs } = require('./endpoints');

logs.get('/', getLogs);
logs.get('/range/count/:offset/:limit/:direction', getLogs);
logs.get('/range/date/:begin/:end/:direction', getLogs);

module.exports = logs;
