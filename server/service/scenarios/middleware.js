const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

const scenarioMap = new WeakMap();

const defaultIdParam = req => Number(req.params.scenario_id);

exports.reqScenario = req => {
    if (!scenarioMap.has(req)) {
        throw new Error(
            'Request has not passed through lookupScenario middleware'
        );
    }
    return scenarioMap.get(req);
};

const scenarioForRequest = async (req, getId = defaultIdParam) => {
    if (scenarioMap.has(req)) {
        return scenarioMap.get(req);
    } else {
        const scenario = await db.getScenario(await getId(req));
        scenarioMap.set(req, scenario);
        return scenario;
    }
};

exports.lookupScenario = (getId = defaultIdParam) =>
    asyncMiddleware(async (req, res, next) => {
        const scenario = await scenarioForRequest(req, getId);
        if (!scenario) {
            const e404 = new Error('Unknown scenario');
            e404.status = 404;
            throw e404;
        }
        // the scenario for the request has been setup.
        return next();
    });
