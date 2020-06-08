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
  return res.json(req.session.user);
};

exports.checkForDuplicate = asyncMiddleware(async function checkForDuplicate(
  req,
  res,
  next
) {
  const username = req.body.username || req.params.username;
  const user = await db.getUserByProps({ username });
  if (user) {
    const error = new Error('User exists.');
    error.status = 409;
    throw error;
  }
  next();
});

async function createUserAsync(req, res, next) {
  const { username, password, email } = req.body;
  const created = await db.createUser({ email, username, password });
  const { roles } = await getUserRoles(created.id);

  if (!created) {
    const error = new Error('User not created. Server error');
    error.status = 500;
    throw error;
  }

  //eslint-disable-next-line require-atomic-updates
  req.session.user = {
    anonymous: false,
    email: created.email,
    id: created.id,
    roles,
    username: created.username
  };

  next();
}

async function loginUserAsync(req, res, next) {
  const { username, email, password } = req.body;
  const user = await db.getUserByProps({ username, email });
  const error = new Error('Invalid username or password.');
  error.status = 401;

  // Case when user is found
  if (user) {
    const { roles } = await getUserRoles(user.id);
    const { salt, hash, id } = user;

    // Case of anonymous user, where only the username / email stored
    if (!password && !hash && !salt) {
      // disabling to set req.session.user
      //eslint-disable-next-line require-atomic-updates
      req.session.user = { anonymous: true, username, email: '', id };
      return next();
    }

    // Case when a passwordless user passes a password
    if (password && !hash && !salt) {
      throw error;
    }

    // Case when a user with a password is supplied without a password
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
        anonymous: false,
        email: user.email,
        id,
        roles,
        username: user.username
      };
      return next();
    }
  }

  throw error;
}

exports.createUser = asyncMiddleware(createUserAsync);
exports.loginUser = asyncMiddleware(loginUserAsync);
