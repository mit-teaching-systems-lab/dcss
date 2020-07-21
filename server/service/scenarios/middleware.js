const { requireUser } = require('../auth/middleware');
const { getUserRoles } = require('../auth/db');
const { asyncMiddleware } = require('../../util/api');
const { getScenario, getScenarioUserRoles } = require('./db');

const scenarioMap = new WeakMap();

exports.reqScenario = req => {
  if (!scenarioMap.has(req)) {
    throw new Error('Request has not passed through lookupScenario middleware');
  }
  return scenarioMap.get(req);
};

const scenarioForRequest = async req => {
  if (scenarioMap.has(req)) {
    return scenarioMap.get(req);
  } else {
    const scenario = await getScenario(Number(req.params.scenario_id));
    scenarioMap.set(req, scenario);
    return scenario;
  }
};

exports.lookupScenario = () =>
  asyncMiddleware(async (req, res, next) => {
    const scenario = await scenarioForRequest(req);
    if (!scenario) {
      const e404 = new Error('Unknown scenario');
      e404.status = 404;
      throw e404;
    }
    // the scenario for the request has been setup.
    return next();
  });

exports.requireScenarioUserRole = roles => [
  requireUser,
  asyncMiddleware(async (req, res, next) => {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    const scenario_id = Number(
      (req.body && req.body.scenario_id) || req.params.scenario_id
    );
    const { roles: userRoles } = await getUserRoles(req.session.user.id);
    const { roles: scenarioUserRoles } = await getScenarioUserRoles(
      scenario_id,
      // Remember: we're not checking the role of the target user,
      // we're verifying the role of the administrating user.
      req.session.user.id
    );

    if (
      // super admin always gets permission
      userRoles.includes('super_admin') ||
      // owner always gets permission
      (scenarioUserRoles && scenarioUserRoles.includes('owner'))
    ) {
      return next();
    }

    // If I have this role both site-wide AND in this cohort,
    // then I have permission to give someone else this role.
    //
    // Q: should "researcher" be allowed to do this?
    //
    if (
      scenarioUserRoles &&
      roles.some(role => scenarioUserRoles.includes(role))
    ) {
      return next();
    }

    const error = new Error(
      'Access Denied: you do not have permission to edit or review this scenario'
    );
    error.status = 401;
    throw error;
  })
];
