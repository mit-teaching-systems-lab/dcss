const db = require('./db');
const { asyncMiddleware } = require('../../util/api');
const { getUserById } = require('../auth/db');

async function getAllUsers(req, res) {
  const users = await db.getAllUsers();
  if (!users) {
    const error = new Error('No users found');
    error.status = 409;
    throw error;
  }
  res.json({ users });
}

async function getAllUsersCount(req, res) {
  const count = await db.getAllUsersCount();
  if (!count) {
    const error = new Error('No users found');
    error.status = 409;
    throw error;
  }
  res.json({ count });
}

async function getAvailableUsers(req, res) {
  const users = await db.getAvailableUsers();
  if (!users) {
    const error = new Error('No users found');
    error.status = 409;
    throw error;
  }
  res.json({ users });
}

async function getAvailableUsersCount(req, res) {
  const count = await db.getAvailableUsersCount();
  if (!count) {
    const error = new Error('No users found');
    error.status = 409;
    throw error;
  }
  res.json({ count });
}

async function getUserRoles(req, res) {
  const user = await db.getUserById(req.session.user.id);

  if (!user) {
    const error = new Error('Invalid user id.');
    error.status = 409;
    throw error;
  }

  const userRoleData = await db.getUserRoles(user.id, req.body.roles);
  res.json(userRoleData);
}

async function getUserPermissions(req, res) {
  const userPermissions = await db.getUserPermissions(req.session.user.id);
  res.json(userPermissions);
}

async function getUsersByPermission(req, res) {
  const permission = req.params.permission;
  const users = await db.getUsersByPermission(permission);
  res.send({ users });
}

async function addUserRoles(req, res) {
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
}

async function deleteUserRoles(req, res) {
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
}

async function setUserRoles(req, res) {
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
}

exports.getAllUsers = asyncMiddleware(getAllUsers);
exports.getAllUsersCount = asyncMiddleware(getAllUsersCount);
exports.getAvailableUsers = asyncMiddleware(getAvailableUsers);
exports.getAvailableUsersCount = asyncMiddleware(getAvailableUsersCount);
exports.getUserRoles = asyncMiddleware(getUserRoles);
exports.getUserPermissions = asyncMiddleware(getUserPermissions);
exports.getUsersByPermission = asyncMiddleware(getUsersByPermission);
exports.addUserRoles = asyncMiddleware(addUserRoles);
exports.deleteUserRoles = asyncMiddleware(deleteUserRoles);
exports.setUserRoles = asyncMiddleware(setUserRoles);
