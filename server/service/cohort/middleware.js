const { asyncMiddleware } = require('../../util/api');
const { requireUser } = require('../auth/middleware');
const db = require('./db');
const rolesMap = new WeakMap();

exports.requireCohortUserRole = roles => [
  requireUser,
  asyncMiddleware(async (req, res, next) => {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }
    const { roles: siteUserRoles } = await db.getSiteUserRoles(
      req.session.user.id
    );

    const { roles: cohortUserRoles } = await db.getCohortUserRoles(
      req.session.user.id, req.body.cohort_id
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


// const rolesForRequest = async req => {
//   if (rolesMap.has(req)) {
//     return rolesMap.get(req);
//   } else {
//     const { roles } = await db.getCohortUserRoles({
//       id: req.body.cohort_id,
//       user_id: req.session.user.id
//     });
//     rolesMap.set(req, roles);
//     return roles;
//   }
// };


// exports.checkCanEditCohortUserRoles = [
//   exports.requireCohortUserRole(['owner', 'facilitator']),
//   asyncMiddleware(async (req, res, next) => {
//     const user_id = req.body.user_id;
//     const roles = req.body.roles;
//     const { roles: targetUserRoles } = await db.getUserRoles(targetUserId);
//     const cohortUserRoles = await rolesForRequest(req);

//     // we throw this on invalid access
//     const error = new Error('Access Denied');
//     error.status = 401;

//     // super admin can do anything!
//     if (cohortUserRoles.includes('super_admin')) {
//       return next();
//     }

//     // unless you are a super admin - you shouldn't be able to edit your own roles
//     if (req.session.user.id == targetUserId) {
//       throw error;
//     }

//     // unless the user was a super_admin, trying to edit a super_admin will fail
//     if (targetUserRoles.includes('super_admin')) {
//       throw error;
//     }

//     // everything else should succeed(for now)
//     return next();
//   })
// ];
