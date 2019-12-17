const { asyncMiddleware } = require('../../util/api');

const db = require('./db');
const { getUserByProps } = require('../auth/db');

exports.getAllUsersRoles = asyncMiddleware(async function getAllUserRolesAsync(
    req,
    res
) {
    const users = await db.getAllUsersRoles();
    const noUsersFoundError = new Error('No users found');
    noUsersFoundError.status = 409;

    if (!users) throw noUsersFoundError;

    res.json({ users, status: 200 });
});

exports.getUserRoles = asyncMiddleware(async function getUserRolesAsync(
    req,
    res
) {
    const userId = req.session.user.id;
    const user = await db.getUserById(userId);
    const noUserFoundError = new Error('Invalid user id.');
    noUserFoundError.status = 409;

    if (!user) throw noUserFoundError;

    const userRoleData = await db.getUserRoles(userId, req.body.roles);
    res.json(userRoleData);
});

exports.getUserPermissions = asyncMiddleware(async function getUserPermissions(
    req,
    res
) {
    const userId = req.session.user.id;
    const userPermissions = await db.getUserPermissions(userId);

    res.json(userPermissions);
});

exports.getUsersByPermission = asyncMiddleware(
    async function getUsersByPermission(req, res) {
        const permission = req.body.permission;
        const usersWithPermission = await db.getUsersByPermission(permission);

        res.send(usersWithPermission);
    }
);

exports.addUserRoles = asyncMiddleware(async function addUserRolesAsync(
    req,
    res
) {
    const { username, email, roles } = req.body;
    const user = await getUserByProps({ username, email });
    const userId = user.id;
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
});

exports.deleteUserRoles = asyncMiddleware(async function deleteUserRolesAsync(
    req,
    res
) {
    const { username, email, roles } = req.body;
    const user = await getUserByProps({ username, email });
    const userId = user.id;
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
});

exports.setUserRoles = asyncMiddleware(async function setUserRolesAsync(
    req,
    res
) {
    const userId = req.session.user.id;
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
});
