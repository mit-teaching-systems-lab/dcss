const { Router } = require('express');
const { validateRequestBody } = require('../../util/requestValidation');
const { lookupScenario } = require('./middleware');

const scenariosRouter = Router();

const {
    getScenario,
    addScenario,
    setScenario,
    deleteScenario
} = require('./endpoints.js');

scenariosRouter.get('/:scenario_id', [lookupScenario(), getScenario]);

scenariosRouter.put('/', [validateRequestBody, addScenario]);

scenariosRouter.post('/:scenario_id', [
    lookupScenario(),
    validateRequestBody,
    setScenario
]);

scenariosRouter.delete('/:scenario_id', [lookupScenario(), deleteScenario]);

module.exports = scenariosRouter;
