const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');

const scenariosRouter = Router();

const {
    getScenario,
    addScenario,
    setScenario,
    deleteScenario
} = require('./endpoints.js');

scenariosRouter.get('/:scenario_id', [getScenario]);

scenariosRouter.put('/', [validateRequestBody, addScenario]);

scenariosRouter.post('/:scenario_id', [validateRequestBody, setScenario]);

scenariosRouter.delete('/:scenario_id', [validateRequestBody, deleteScenario]);

module.exports = scenariosRouter;
