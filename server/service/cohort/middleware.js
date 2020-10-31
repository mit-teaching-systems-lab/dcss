const { asyncMiddleware } = require('../../util/api');
const { getUserRoles } = require('../auth/db');
const { getCohortUserRoles } = require('./db');

// const rolesMap = new WeakMap();

exports.requireCohortUserRole = roles => [
  asyncMiddleware(async (req, res, next) => {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }
    const { roles: siteUserRoles } = await getUserRoles(req.session.user.id);

    const { roles: cohortUserRoles } = await getCohortUserRoles(
      req.session.user.id,
      req.body.cohort_id
    );

    if (
      // super admin always gets permission
      siteUserRoles.includes('super_admin') ||
      // owner always gets permission
      cohortUserRoles.includes('owner')
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
      roles.some(role => cohortUserRoles.includes(role))
    ) {
      return next();
    }

    const error = new Error('Access Denied');
    error.status = 401;
    throw error;
  })
];
