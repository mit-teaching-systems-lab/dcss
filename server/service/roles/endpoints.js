const { asyncMiddleware } = require('../../util/api');

const db = require('./db');

const { getUserById } = require('../auth/db');

exports.getUserRolesAsync = async function(req, res) {
    const userId = Number(req.params.user_id);
    const user = await getUserById(userId);

    const noUserFoundError = new Error('Invalid user id.');
    noUserFoundError.status = 409;

    if (!user) {
        throw noUserFoundError;
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

    // TODO: Further Permissions Checks - can this user edit these roles?

    try {
        const result = await db.addUserRoles(userId, roles);
        res.json(result);
    } catch (apiError) {
        const error = new Error('Error while editing roles');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
};

exports.addUserRoles = asyncMiddleware(exports.addUserRolesAsync);

exports.deleteUserRolesAsync = async function(req, res) {
    const userId = Number(req.params.user_id);
    const roles = req.body.roles;
    if (!userId || !roles.length) {
        const error = new Error('User and roles must be defined');
        error.status = 409;
        throw error;
    }

    // TODO: Further Permissions Checks - can this user edit these roles?

    try {
        const result = await db.deleteUserRoles(userId, roles);
        res.json(result);
    } catch (apiError) {
        const error = new Error('Error while editing roles');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
};

exports.deleteUserRoles = asyncMiddleware(exports.deleteUserRolesAsync);

exports.setUserRolesAsync = async function(req, res) {
    const userId = Number(req.params.user_id);
    const roles = req.body.roles;
    if (!userId || !roles.length) {
        const roleCreateError = new Error('User and roles must be defined');
        roleCreateError.status = 409;
        throw roleCreateError;
    }

    // TODO: Further Permissions Checks - can this user edit these roles?

    try {
        const result = await db.setUserRoles(userId, roles);
        res.json(result);
    } catch (apiError) {
        const error = new Error('Error while editing roles');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
};

exports.setUserRoles = asyncMiddleware(exports.setUserRolesAsync);
