const { Pool } = require('pg');
const { sql } = require('./sqlHelpers');
const { saltHashPassword } = require('./pwHash');

const pool = new Pool();

const getUser = async function(req, res, next) {
    const { username, email } = req.body;
    const client = await pool.connect();

    const result = await client.query(sql`SELECT * FROM users WHERE email = ${email} OR username = ${username};`);
    client.release();

    if(result.rows.length > 0) {
        res.status(409).send({ error: 'Duplicated user. User already exists!' });
        return;
    }

    next();
}

const createUser = async function(email, username, password) {
     const client = await pool.connect();
    try {
        let salt, passwordHash;
        if (password) {
            let passwordObj = saltHashPassword(password);
            salt = passwordObj.salt;
            passwordHash = passwordObj.passwordHash;
        }
        await client.query('BEGIN');
        await client.query(sql`INSERT INTO users(email, username, hash, salt)
            VALUES(${email}, ${username}, ${passwordHash}, ${salt});`);
        await client.query('COMMIT');
        return true;
    } catch (e) {
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
};

module.exports = { createUser, getUser };
