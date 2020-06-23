const { asyncMiddleware } = require('../../util/api');
const { validateHashPassword } = require('../../util/pwHash');
const db = require('./db');
const { getUserRoles } = require('../roles/db');

exports.requireUser = (req, res, next) => {
  if (!req.session.user) {
    const error = new Error('Not logged in!');
    error.status = 401;
    throw error;
  }
  next();
};

exports.respondWithUser = (req, res) => {
  return res.json({ user: req.session.user });
};

async function checkForDuplicateAsync(req, res, next) {
  const username = req.body.username || req.params.username;
  const user = await db.getUserByProps({ username });
  if (user) {
    const error = new Error('User exists.');
    error.status = 409;
    throw error;
  }
  next();
}

async function createUserAsync(req, res, next) {
  const { username, password, email } = req.body;
  const created = await db.createUser({ email, username, password });
  // const { roles } = await getUserRoles(created.id);

  if (!created) {
    const error = new Error('User could not be created.');
    error.status = 500;
    throw error;
  }

  const anonymous = typeof password === 'undefined' || typeof email === 'undefined';

  //eslint-disable-next-line require-atomic-updates
  req.session.user = {
    ...created
  };

  next();
}

async function updateUserAsync(req, res, next) {
  const { username, password, email } = req.body;
  const { id } = req.session.user;
  const updates = {};

  if (email) {
    updates.email = email;
  }

  if (password) {
    updates.password = password;
  }

  if (username) {
    updates.username = username;
  }

  const user = await db.updateUser(id, updates);

  if (!user) {
    const error = new Error('User could not be updated.');
    error.status = 500;
    throw error;
  }

  const anonymous = typeof password === 'undefined' || typeof email === 'undefined';

  {
    //eslint-disable-next-line require-atomic-updates
    req.session.user = {
      ...user
    };
  }

  next();
}

async function loginUserAsync(req, res, next) {
  const { username, email, password } = req.body;
  const existing = await db.getUserByProps({ username, email });
  const error = new Error('Invalid username or password.');
  error.status = 401;

  // Case when user is found
  if (existing) {
    console.log(existing.id);
    const user = await db.getUserById(existing.id);
    console.log(user);
    const { salt, hash, id } = existing;

    // Case of anonymous user, where only a username is created.
    if (!email || (!password && !hash && !salt)) {
      // disabling to set req.session.user
      //eslint-disable-next-line require-atomic-updates
      req.session.user = {
        ...user
      };
      return next();
    }

    // Case when a passwordless user passes a password
    if (password && !hash && !salt) {
      throw error;
    }

    // Case when a user with a password is attempts to
    // log in without a password
    if (!password && hash && salt) {
      throw error;
    }
    // Case when user has a password is supplied with a password
    const { passwordHash } = validateHashPassword(password, salt);
    const match = hash === passwordHash;
    if (match) {
      // disabling to set req.session.user
      //eslint-disable-next-line require-atomic-updates
      req.session.user = {
        ...user
      };
      return next();
    }
  }

  throw error;
}

exports.createUser = asyncMiddleware(createUserAsync);
exports.loginUser = asyncMiddleware(loginUserAsync);
exports.updateUser = asyncMiddleware(updateUserAsync);
exports.checkForDuplicate = asyncMiddleware(checkForDuplicateAsync);

