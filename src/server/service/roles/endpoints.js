const { asyncMiddleware } = require('../../util/api');

const db = require('./db');

const { getUserById } = require('../../util/authenticationHelpers');

exports.getUserRolesAsync = async function(req, res) {
    const userId = Number(req.params.user_id);
    const user = await getUserById(userId);

    const noUserFoundError = new Error('Invalid user id.');
    noUserFoundError.status = 409;

    if (!user) {
        return apiError(res, noUserFoundError);
    }

    const userRoleData = await db.getUserRoles(userId, req.body.roles);
    res.json(userRoleData);
};

exports.getUserRoles = asyncMiddleware(exports.getUserRolesAsync);

exports.addUserRolesAsync = async function(req, res) {
    const userId = Number(req.params.user_id);
    const roles = req.body.roles;
    if (!userId || !roles.length) {
        const roleCreateError = new Error('User and roles must be defined');
        roleCreateError.status = 409;
        throw roleCreateError;
    }

    // TODO: Further Permissions Checks - can this user give these roles?

    const result = await db.addUserRoles(userId, roles);

    if (result.status != 201) {
        throw result;
    }

    res.sendStatus(201);
};

exports.addUserRoles = asyncMiddleware(exports.addUserRolesAsync);

exports.deleteUserRolesAsync = async function(req, res) {
    const userId = Number(req.params.user_id);
    const roles = req.body.roles;
    if (!userId || !roles.length) {
        const roleCreateError = new Error('User and roles must be defined');
        roleCreateError.status = 409;
        throw roleCreateError;
    }

    // TODO: Further Permissions Checks - can this user give these roles?

    const result = await db.deleteUserRoles(userId, roles);

    if (result.status >= 300) {
        throw result;
    }

    res.sendStatus(result.status);
};

exports.deleteUserRoles = asyncMiddleware(exports.deleteUserRolesAsync);
