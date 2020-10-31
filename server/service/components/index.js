const { Router } = require('express');
const components = new Router();
const {
  getComponentsByUserId,
  getComponentsByScenarioId
} = require('./endpoints');

components.get('/user/:user_id', getComponentsByUserId);
components.get('/scenario/:scenario_id', getComponentsByScenarioId);

module.exports = components;
