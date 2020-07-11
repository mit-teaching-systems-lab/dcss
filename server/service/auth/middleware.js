const { asyncMiddleware } = require('../../util/api');
const { validateHashPassword } = require('../../util/pwHash');
const db = require('./db');
// const { getUserRoles } = require('../roles/db');

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

async function respondWithUserAndUpdatedSessionAsync(req, res) {
  const user = await db.getUserById(req.session.user.id);
  if (!user) {
    const error = new Error('User does not exist.');
    error.status = 409;
    throw error;
  }

  //eslint-disable-next-line require-atomic-updates
  req.session.user = {
    ...user
  };

  return res.json({ user: req.session.user });
}

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

  // const anonymous =
  //   typeof password === 'undefined' || typeof email === 'undefined';

  //eslint-disable-next-line require-atomic-updates
  req.session.user = {
    ...created
  };

  next();
}

async function updateUserAsync(req, res, next) {
  const { username, password, email, personalname } = req.body;
  const { id } = req.session.user;
  const updates = {};

  if (personalname) {
    updates.personalname = personalname;
  }

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

  // const anonymous =
  //   typeof password === 'undefined' || typeof email === 'undefined';
  // eslint-disable-next-line require-atomic-updates
  req.session.user = {
    ...user
  };

  next();
}

async function loginUserAsync(req, res, next) {
  const { username, email, password } = req.body;
  const existing = await db.getUserByProps({ username, email });

  // Case when user is found
  if (existing) {
    const user = await db.getUserById(existing.id);
    const { salt, hash } = existing;

    // Case when a user with a password is attempts to
    // log in without a password
    if (!password) {
      if (hash && salt) {
        const error = new Error('This account requires a password.');
        error.status = 401;
        throw error;
      }
    }

    if (password) {
      // Anonymous user attempts to provide a password
      if (!hash && !salt) {
        const error = new Error('This account does not require a password.');
        error.status = 401;
        throw error;
      }

      // Reified user login: has password and provided it.
      if (hash && salt) {
        const { passwordHash } = validateHashPassword(password, salt);
        if (hash !== passwordHash) {
          const error = new Error('Invalid password.');
          error.status = 401;
          throw error;
        }
      }
    }

    // eslint-disable-next-line require-atomic-updates
    req.session.user = {
      ...user
    };
    return next();
  }

  const error = new Error('Authentication failed.');
  error.status = 401;
  throw error;
}

exports.createUser = asyncMiddleware(createUserAsync);
exports.loginUser = asyncMiddleware(loginUserAsync);
exports.updateUser = asyncMiddleware(updateUserAsync);
exports.checkForDuplicate = asyncMiddleware(checkForDuplicateAsync);
exports.respondWithUserAndUpdatedSession = asyncMiddleware(
  respondWithUserAndUpdatedSessionAsync
);
