const { asyncMiddleware } = require('../../util/api');
const { validateHashPassword } = require('../../util/pwHash');
const db = require('./db');

exports.requireUser = (req, res, next) => {
    if (!req.session.user) {
        const error = new Error('Not logged in!');
        error.status = 401;
        next(error);
    }
    next();
};

// this is technically an "endpoint" but the only one in this whole service for now
exports.respondWithUser = (req, res) => {
    return res.json(req.session.user);
};

exports.checkForDuplicate = asyncMiddleware(async function checkForDuplicate(
    req,
    res,
    next
) {
    const { username, email } = req.body;
    const user = await db.getUserByProps({ username, email });
    if (user) {
        const duplicatedUserError = new Error('User exists.');
        duplicatedUserError.status = 409;
        throw duplicatedUserError;
    }
    next();
});

exports.createUser = asyncMiddleware(async function createUser(req, res, next) {
    const { username, password, email } = req.body;
    const created = await db.createUser({ email, username, password });

    if (!created) {
        const userCreateError = new Error('User not created. Server error');
        userCreateError.status = 500;
        throw userCreateError;
    }

    //eslint-disable-next-line require-atomic-updates
    req.session.user = {
        anonymous: false,
        username: created.username,
        email: created.email,
        id: created.id
    };

    next();
});

exports.loginUser = asyncMiddleware(async function loginUser(req, res, next) {
    const { username, email, password } = req.body;
    const user = await db.getUserByProps({ username, email });

    const invalidUserError = new Error('Invalid username or password.');
    invalidUserError.status = 401;

    // Case when user is found
    if (user) {
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
            throw invalidUserError;
        }

        // Case when a user with a password is supplied without a password
        if (!password && hash && salt) {
            throw invalidUserError;
        }
        // Case when user has a password is supplied with a password
        const { passwordHash } = validateHashPassword(password, salt);
        const match = hash === passwordHash;
        if (match) {
            // disabling to set req.session.user
            //eslint-disable-next-line require-atomic-updates
            req.session.user = {
                anonymous: false,
                username: user.username,
                email: user.email,
                id
            };
            return next();
        }
    }

    throw invalidUserError;
});
