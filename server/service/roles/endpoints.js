const db = require('./db');
const { asyncMiddleware } = require('../../util/api');
const { getUserById } = require('../auth/db');

exports.getAllUsersRoles = asyncMiddleware(async function getAllUserRolesAsync(
  req,
  res
) {
  const users = await db.getAllUsersRoles();
  if (!users) {
    const error = new Error('No users found');
    error.status = 409;
    throw error;
  }
  res.json({ users });
});

exports.getUserRoles = asyncMiddleware(async function getUserRolesAsync(
  req,
  res
) {
  const user = await db.getUserById(req.session.user.id);

  if (!user) {
    const error = new Error('Invalid user id.');
    error.status = 409;
    throw error;
  }

  const userRoleData = await db.getUserRoles(user.id, req.body.roles);
  res.json(userRoleData);
});

exports.getUserPermissions = asyncMiddleware(async function getUserPermissions(
  req,
  res
) {
  const userPermissions = await db.getUserPermissions(req.session.user.id);
  res.json(userPermissions);
});

exports.getUsersByPermission = asyncMiddleware(
  async function getUsersByPermission(req, res) {
    const permission = req.params.permission;
    const users = await db.getUsersByPermission(permission);
    res.send({ users });
  }
);

exports.addUserRoles = asyncMiddleware(async function addUserRolesAsync(
  req,
  res
) {
  const { user_id, roles } = req.body;
  const user = await getUserById(user_id);
  if (!user.id || !roles.length) {
    const error = new Error('User and roles must be defined');
    error.status = 409;
    throw error;
  }

  // TODO: Further Permissions Checks - can this user edit these roles?

  try {
    const result = await db.addUserRoles(user.id, roles);
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
  const { user_id, roles } = req.body;
  const user = await getUserById(user_id);
  if (!user.id || !roles.length) {
    const error = new Error('User and roles must be defined');
    error.status = 409;
    throw error;
  }

  // TODO: Further Permissions Checks - can this user edit these roles?

  try {
    const result = await db.deleteUserRoles(user.id, roles);
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
  if (!req.session.user.id || !req.body.roles.length) {
    const error = new Error('User and roles must be defined');
    error.status = 409;
    throw error;
  }

  // TODO: Further Permissions Checks - can this user edit these roles?

  try {
    const result = await db.setUserRoles(req.session.user.id, req.body.roles);
    res.json(result);
  } catch (apiError) {
    const error = new Error('Error while editing roles');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
});
