const Sendgrid = require('@sendgrid/mail');
const Nodemailer = require('nodemailer');
const Crypto = require('crypto-js');
const passwordGenerator = require('password-generator');
const { asyncMiddleware } = require('../../util/api');
const { validateHashPassword } = require('../../util/pwHash');
const db = require('./db');
// const { getUserRoles } = require('../roles/db');

Sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

function decrypt(encryptedString) {
  return Crypto.AES.decrypt(
    encryptedString,
    process.env.SESSION_SECRET || 'mit tsl teacher moments'
  ).toString(Crypto.enc.Utf8);
}

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
    const error = new Error('Username is already in use.');
    error.status = 409;
    throw error;
  }
  next();
}

async function createUserAsync(req, res, next) {
  let { username, password, email } = req.body;

  if (password) {
    password = decrypt(password);
  }

  const created = await db.createUser({ email, username, password });

  if (!created) {
    const error = new Error('User could not be created.');
    error.status = 500;
    throw error;
  }

  //eslint-disable-next-line require-atomic-updates
  req.session.user = {
    ...created
  };

  next();
}

async function updateUserAsync(req, res, next) {
  let { username, personalname, password, email } = req.body;

  if (password) {
    password = decrypt(password);
  }

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
  const { username, email } = req.body;
  const password = decrypt(req.body.password);

  console.log(username, email);
  const existing = await db.getUserByProps({ username, email });

  // Case when user is found
  if (existing) {
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

    const user = await db.getUserById(existing.id);

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
  // First, check if this is a raw email address.
  // If it is, don't do the reset. We should only
  // receive encoded email values. That prevents
  // this endpoint from becoming a spam generator.
  {
    const { email } = req.body;
    const existing = await db.getUserByProps({ email });
    if (existing) {
      res.json({ reset: false });
    }
  }

  const href = req.body.href.replace(/\/reset/, '');
  const email = decrypt(req.body.email);

  const user = await db.getUserByProps({ email });
  let reset = true;
  let reason = 'Success';

  if (user) {
    // 1. Make a new password.
    let password = passwordGenerator(12, false, /[\w\d?-]/, '');

    // 2. Update the user account(s) with new password.
    //    Why is that plural? Because we've allowed users to create
    //    multiple accounts with the same email address,
    //    don't actually require an email address, nor does it
    //    indicate the identity of any given user.
    await db.updateUserWhere(
      { email },
      {
        single_use_password: true,
        password
      }
    );

    // 3. Email the temporary password to the user.
    const brandTitle = process.env.DCSS_BRAND_NAME_TITLE || '';
    const subject = `${process.env.DCSS_BRAND_NAME_TITLE ||
      ''} Single-use password request`.trim();
    const text = `
You are receiving this email because you (or someone else) made a request to reset your ${brandTitle} password.
The following password may only be used once. After you've logged in, go to Settings and update your password.
\n\n
Single-use password: ${password}\n\n

Manage your account here: ${href}
`;
    const html = `<p>You are receiving this email because you (or someone else) made a request to reset your ${brandTitle} password. The following password may only be used once. After you've logged in, go to Settings and update your password.</p>
<p>
Single-use password: <code>${password}</code>
</p>

<p>
<a href="${href}">Manage your account here</a>
</p>
`;
    const message = {
      to: email,
      from: `${brandTitle} <${process.env.SENDGRID_SENDER}>`,
      subject,
      text,
      html
    };
    if (process.env.SENDGRID_API_KEY) {
      try {
        await Sendgrid.send(message);
      } catch (error) {
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
    reset = false;
    reason = 'The email provided does not match any existing account.';
  }

  return res.json({ reset, reason });
}

exports.createUser = asyncMiddleware(createUserAsync);
exports.loginUser = asyncMiddleware(loginUserAsync);
exports.resetUserPassword = asyncMiddleware(resetUserPasswordAsync);
exports.updateUser = asyncMiddleware(updateUserAsync);
exports.checkForDuplicate = asyncMiddleware(checkForDuplicateAsync);
exports.respondWithUserAndUpdatedSession = asyncMiddleware(
  respondWithUserAndUpdatedSessionAsync
);
