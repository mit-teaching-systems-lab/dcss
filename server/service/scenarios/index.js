const { Router } = require('express');
const { validateRequestBody } = require('../../util/requestValidation');
const { lookupScenario } = require('./middleware');

const router = Router();

const {
    addScenario,
    copyScenario,
    deleteScenario,
    getAllScenarios,
    getScenario,
    getScenarioDataResearcher,
    getScenarioByRun,
    setScenario,
    softDeleteScenario
} = require('./endpoints.js');

router.get('/', getAllScenarios);
router.get('/run', getScenarioByRun);
router.get('/:scenario_id', [lookupScenario(), getScenario]);

// TODO: there should be a middleware here to check for permissions
router.get('/:scenario_id/data/researcher', getScenarioDataResearcher);

router.put('/', [validateRequestBody, addScenario]);

router.post('/:scenario_id', [
    lookupScenario(),
    validateRequestBody,
    setScenario
]);

router.post('/:scenario_id/copy', [lookupScenario(), copyScenario]);

router.delete('/:scenario_id', [lookupScenario(), softDeleteScenario]);
router.delete('/:scenario_id/hard', [lookupScenario(), deleteScenario]);

router.use('/:scenario_id/slides', [lookupScenario(), require('./slides')]);

module.exports = router;
