const { Router } = require('express');
const { validateRequestBody } = require('../../util/requestValidation');
const { lookupScenario } = require('./middleware');

const scenariosRouter = Router();

const {
    getScenario,
    getAllScenarios,
    addScenario,
    setScenario,
    deleteScenario
} = require('./endpoints.js');

scenariosRouter.get('/', getAllScenarios);
scenariosRouter.get('/:scenario_id', [lookupScenario(), getScenario]);

scenariosRouter.put('/', [validateRequestBody, addScenario]);

scenariosRouter.post('/:scenario_id', [
    lookupScenario(),
    validateRequestBody,
    setScenario
]);

scenariosRouter.delete('/:scenario_id', [lookupScenario(), deleteScenario]);

scenariosRouter.use('/:scenario_id/slides', [
    lookupScenario(),
    require('./slides')
]);

module.exports = scenariosRouter;
