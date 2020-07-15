const { requireUser } = require('../auth/middleware');
const { getUserRoles } = require('../auth/db');
const { asyncMiddleware } = require('../../util/api');
const { getScenario, getScenarioUserRoles } = require('./db');

const scenarioMap = new WeakMap();

const defaultIdParam = req => Number(req.params.scenario_id);

exports.reqScenario = req => {
  if (!scenarioMap.has(req)) {
    throw new Error('Request has not passed through lookupScenario middleware');
  }
  return scenarioMap.get(req);
};

const scenarioForRequest = async (req, getId = defaultIdParam) => {
  if (scenarioMap.has(req)) {
    return scenarioMap.get(req);
  } else {
    const scenario = await getScenario(await getId(req));
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

exports.requireScenarioUserRole = roles => [
  requireUser,
  asyncMiddleware(async (req, res, next) => {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    const { roles: siteUserRoles } = await getUserRoles(req.session.user.id);

    const { roles: scenarioUserRoles } = await getScenarioUserRoles(
      // Remember: we're not checking the role of the target user,
      // we're verifying the role of the administrating user.
      req.session.user.id,
      req.body.scenario_id || defaultIdParam(req)
    );

    if (
      // super admin always gets permission
      siteUserRoles.includes('super_admin') ||
      // owner always gets permission
      scenarioUserRoles.includes('owner')
    ) {
      return next();
    }

    // If I have this role both site-wide AND in this cohort,
    // then I have permission to give someone else this role.
    //
    // Q: should "researcher" be allowed to do this?
    //
    if (
      roles.some(role => siteUserRoles.includes(role)) &&
      roles.some(role => scenarioUserRoles.includes(role))
    ) {
      return next();
    }

    const error = new Error('Access Denied');
    error.status = 401;
    throw error;
  })
];
