const { Pool } = require('pg');
const { sql } = require('./sqlHelpers');
const { saltHashPassword, validateHashPassword } = require('./pwHash');
const { apiError, asyncMiddleware } = require('./api');

const pool = new Pool();

const getUserInDatabase = async function(username, email) {
    const client = await pool.connect();
    const result = await client.query(
        sql`SELECT * FROM users WHERE email = ${email} OR username = ${username};`
    );
    client.release();
    return result.rows;
};

const getUserById = async function(id) {
    const client = await pool.connect();
    const result = await client.query(
        sql`SELECT username, email FROM users WHERE id=${id}`
    );
    client.release();
    return result.rows[0];
};

const userExistsInDatabase = async function(username, email) {
    const rows = await getUserInDatabase(username, email);
    let user = null;
    if (rows.length > 0) {
        user = rows[0];

        // Undo user setting if username or email mismatches
        if (username && user.username !== username) user = null;
        if (email && user.email !== email) user = null;
    }

    return user;
};

const duplicatedUserInDatabase = async function(req, res, next) {
    const { username, email } = req.body;
    const user = await userExistsInDatabase(username, email);
    if (user) {
        const duplicatedUserError = new Error('User exists.');
        duplicatedUserError.status = 409;
        return apiError(res, duplicatedUserError);
    }
    next();
};

const loginUserBackend = async function(req, res, next) {
    const { username, email, password } = req.body;
    const user = await userExistsInDatabase(username, email);
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
            // send JSON API error
            return apiError(res, new Error('Anonymous user supplied.'));
        }

        // Case when a user with a password is supplied without a password
        if (!password && hash && salt) {
            return apiError(
                res,
                new Error('Username / email supplied requires a password')
            );
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

    const invalidUserError = new Error('Invalid username or password.');
    invalidUserError.status = 401;
    return apiError(res, invalidUserError);
};

const createUserInDatabase = async function(email, username, password) {
    const client = await pool.connect();
    let created = false;
    try {
        let salt, passwordHash;
        if (password) {
            let passwordObj = saltHashPassword(password);
            salt = passwordObj.salt;
            passwordHash = passwordObj.passwordHash;
        }
        await client.query('BEGIN');
        const result = await client.query(sql`INSERT INTO users(email, username, hash, salt)
            VALUES(${email}, ${username}, ${passwordHash}, ${salt}) RETURNING *;`);
        await client.query('COMMIT');
        created = result.rows[0];
    } catch (e) {
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }

    return created;
};

const createUserBackend = async function(req, res, next) {
    const { username, password, email } = req.body;
    const created = await createUserInDatabase(email, username, password);

    if (!created) {
        const userCreateError = new Error('User not created. Server error');
        userCreateError.status = 500;
        return apiError(res, userCreateError);
    }

    //eslint-disable-next-line require-atomic-updates
    req.session.user = {
        anonymous: false,
        username: created.username,
        email: created.email,
        id: created.id
    };

    next();
};

const duplicatedUser = asyncMiddleware(duplicatedUserInDatabase);
const createUser = asyncMiddleware(createUserBackend);
const loginUser = asyncMiddleware(loginUserBackend);

const requireUser = (req, res, next) => {
    if (!req.session.user) {
        const error = new Error('Not logged in!');
        error.status = 401;
        return apiError(res, error);
    }
    next();
};

const respondWithUser = (req, res) => {
    return res.json(req.session.user);
};

module.exports = {
    createUser,
    duplicatedUser,
    getUserById,
    loginUser,
    requireUser,
    respondWithUser
};
