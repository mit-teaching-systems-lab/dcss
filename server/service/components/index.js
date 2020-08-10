const { Router } = require('express');
const components = new Router();
const {
  getComponents,
  getComponentsByUserId,
  getComponentsByScenarioId
} = require('./endpoints');

components.get('/', getComponents);
components.get('/user/:user_id', getComponentsByUserId);
components.get('/scenario/:scenario_id', getComponentsByScenarioId);

module.exports = components;
