const Sendgrid = require('@sendgrid/mail');
const Nodemailer = require('nodemailer');
const Crypto = require('crypto-js');
const generatePassword = require('password-generator');
const { asyncMiddleware } = require('../../util/api');
const { validateHashPassword } = require('../../util/pwHash');
const db = require('./db');
// const { getUserRoles } = require('../roles/db');

Sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

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
    const { single_use_password, salt, hash } = existing;

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

    if (single_use_password) {
      await db.updateUser(user.id, {
        single_use_password: false,
        password: ''
      });
    }


    return next();
  }

  const error = new Error('Authentication failed.');
  error.status = 401;
  throw error;
}

async function resetUserPasswordAsync(req, res) {

  // First, check if this is a raw email address. If it is,
  // don't do the reset.
  {
    const { email } = req.body;
    const existing = await db.getUserByProps({ email });
    if (existing) {
      res.json({ reset: false });
    }
  }

  const email = Crypto.AES.decrypt(
    req.body.email,
    process.env.SESSION_SECRET || 'mit tsl teacher moments'
  ).toString(Crypto.enc.Utf8);

  console.log(email);

  const user = await db.getUserByProps({ email });
  let reset = true;

  if (user) {
    // 1. Make a new password.
    let password = generatePassword(12, false, /[\w\d\?\-]/, '');

    // 2. Update the user account with new password.
    await db.updateUser(user.id, {
      single_use_password: true,
      password,
    });

    // 3. Email the temporary password to the user.
    //
    const subject = `${process.env.DCSS_BRAND_NAME_TITLE || ''} Single Use Password Request`.trim();
    const text = `
You are receiving this email because you (or someone else) have made a request to reset your ${process.env.DCSS_BRAND_NAME_TITLE || ''} password.
The following password may only be used once. After you've logged in, go to Settings and update your password.
\n\n
Single use password: ${password}\n\n
`;
    const message = {
      to: email,
      from: process.env.SENDGRID_SENDER,
      subject,
      text
    };
    if (process.env.SENDGRID_API_KEY) {

      try {
        await Sendgrid.send(message);
      } catch (error) {
        console.log("SENDGRID:", error);
        error.status = 401;
        throw error;
      }
    } else {
      const transport = Nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASS
        }
      });

      try {
        await transport.sendMail(message);
      } catch (error) {
        error.status = 401;
        throw error;
      }
    }
  } else {
    reset = false
  }

  return res.json({ reset });
}

exports.createUser = asyncMiddleware(createUserAsync);
exports.loginUser = asyncMiddleware(loginUserAsync);
exports.resetUserPassword = asyncMiddleware(resetUserPasswordAsync);
exports.updateUser = asyncMiddleware(updateUserAsync);
exports.checkForDuplicate = asyncMiddleware(checkForDuplicateAsync);
exports.respondWithUserAndUpdatedSession = asyncMiddleware(
  respondWithUserAndUpdatedSessionAsync
);
