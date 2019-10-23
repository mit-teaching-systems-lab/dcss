const { asyncMiddleware } = require('../../util/api');
const { requireUser } = require('../auth/middleware');
const db = require('./db');

const rolesMap = new WeakMap();

const rolesForRequest = async req => {
    if (rolesMap.has(req)) {
        return rolesMap.get(req);
    } else {
        const { roles } = await db.getUserRoles(req.session.user.id);
        rolesMap.set(req, roles);
        return roles;
    }
};

exports.requireUserRole = roles => [
    requireUser,
    asyncMiddleware(async function requireUserRole(req, res, next) {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
        const userRoles = await rolesForRequest(req);
        if (
            // super admin wins - always gets permission for this
            userRoles.includes('super_admin') ||
            roles.every(role => userRoles.includes(role))
        ) {
            return next();
        }
        const error = new Error('Access Denied');
        error.status = 401;
        throw error;
    })
];

exports.checkCanEditUserRoles = getEditUserId => [
    // only admin can edit user roles
    exports.requireUserRole('admin'),
    asyncMiddleware(async function checkCanEditUser(req, res, next) {
        const targetUserId = await getEditUserId(req);
        const { roles: targetUserRoles } = await db.getUserRoles(targetUserId);
        const userRoles = await rolesForRequest(req);

        // we throw this on invalid access
        const accessError = new Error('Access Denied');
        accessError.status = 401;

        // super admin can do anything!
        if (userRoles.includes('super_admin')) {
            return next();
        }

        // unless you are a super admin - you shouldn't be able to edit your own roles
        if (req.session.user.id == targetUserId) {
            throw accessError;
        }

        // unless the user was a super_admin, trying to edit a super_admin will fail
        if (targetUserRoles.includes('super_admin')) {
            throw accessError;
        }

        // everything else should succeed(for now)
        return next();
    })
];
