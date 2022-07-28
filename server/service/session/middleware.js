const Crypto = require('crypto-js');
const passwordGenerator = require('password-generator');
const { asyncMiddleware } = require('../../util/api');
const { validateHashPassword } = require('../../util/pwHash');
const { sendMailMessage } = require('../mail/endpoints');
const db = require('./db');

function decrypt(encryptedString) {
  return Crypto.AES.decrypt(
    encryptedString,
    process.env.SESSION_SECRET || 'mit tsl teacher moments'
  ).toString(Crypto.enc.Utf8);
}

exports.requireUser = (req, res, next) => {
  if (!req.session.user) {
    const error = new Error('User is not authenticated.');
    error.status = 401;
    throw error;
  }
  next();
};

exports.respondWithUser = (req, res) => {
  return res.json({ user: req.session.user });
};

async function refreshSessionAsync(req, res, next) {
  const user = await db.getUserById(req.session.user.id);
  if (!user) {
    const error = new Error('User does not exist.');
    error.status = 404;
    throw error;
  }

  //eslint-disable-next-line require-atomic-updates
  req.session.user = {
    ...user
  };

  next();
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
  let password = req.body.password;

  if (password) {
    password = decrypt(password);
  }

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

    next();
  } else {
    const error = new Error('Authentication failed.');
    error.status = 401;
    throw error;
  }
}

//
//
// TODO: break this into smaller tasks
//
//
async function resetUserPasswordAsync(req, res) {
  // First, check if this is a raw email address.
  // If it is, don't do the reset. We should only
  // receive encoded email values. That prevents
  // this endpoint from becoming a spam generator.
  {
    const { email } = req.body;
    const existing = await db.getUserByProps({ email });
    if (existing) {
      res.json({
        reset: false,
        reason:
          'Cannot use a plain text email address to generate a password reset request'
      });
      return;
    }
  }

  const origin = `${req.body.origin}/settings`;
  const email = decrypt(req.body.email);
  const username = decrypt(req.body.username);
  const user = await db.getUserByProps({ username });

  let reset = true;
  let reason = 'Success';

  if (user) {
    // 1. Make a new password.
    let password = passwordGenerator(12, false, /[\w\d?-]/, '');

    // 2. Update the user account(s) with new password.
    //    Why is that optionally plural? Because we've allowed
    //    users to create multiple accounts with the same email
    //    address, don't actually require an email address, nor
    //    does it indicate the identity of any given user.
    await db.updateUserWhere(
      { email, username },
      {
        single_use_password: true,
        password
      }
    );

    //
    //
    //
    // TODO: Move this into template?
    //
    //
    //
    // 3. Email the temporary password to the user.
    const brandTitle = process.env.DCSS_BRAND_NAME_TITLE || '';
    const subject = `${brandTitle} Single-use password request`.trim();

    // TODO: Consolidate all of this into a single message.
    const text = `
You are receiving this email because a request was made to reset your ${brandTitle} password.
The following password may only be used once. After you've logged in, go to Settings and update your password.
\n\n
Username: ${username}\n\n
\n\n
Single-use password: ${password}\n\n

Click here to update your account settings: ${origin}


------------------------------------------
Massachusetts Institute of Technology NE49
600 Technology Square
Cambridge, MA 02139
`;
    const html = `<p>You are receiving this email because a request was made to reset your ${brandTitle} password. The following password may only be used once. After you've logged in, go to Settings and update your password.</p>
<p>
Username: <code>${username}</code>
</p>
<p>
Single-use password: <code>${password}</code>
</p>

<p>
<a href="${origin}">Click here to update your account settings: ${origin}</a>
</p>

<p>
<small>
Massachusetts Institute of Technology NE49<br>
600 Technology Square<br>
Cambridge, MA 02139
</small>
</p>
`;
    const message = {
      to: email,
      from: `${brandTitle} <${process.env.SENDGRID_SENDER}>`,
      subject,
      text,
      html
    };

    const result = await sendMailMessage(message);
    reset = result.sent;
    if (!reset) {
      reason = result.reason;
    }
  } else {
    reset = false;
    reason = 'The email provided does not match any existing account.';
  }

  if (!reset) {
    return res.status(401).json({
      error: true,
      message: reason
    });
  }

  return res.json({ reset, reason });
}

exports.createUser = asyncMiddleware(createUserAsync);
exports.loginUser = asyncMiddleware(loginUserAsync);
exports.resetUserPassword = asyncMiddleware(resetUserPasswordAsync);
exports.updateUser = asyncMiddleware(updateUserAsync);
exports.checkForDuplicate = asyncMiddleware(checkForDuplicateAsync);
exports.refreshSession = asyncMiddleware(refreshSessionAsync);
