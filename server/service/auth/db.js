const { sql } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');
const { saltHashPassword } = require('../../util/pwHash');

exports.getUserByProps = async function({ id, username, email }) {
    // This query looks a little ugly, but it allows us to pass in empty stuff for id, username or email!
    const result = await query(
        sql`SELECT * FROM users WHERE id = ${id} 
            OR (email = ${email} AND email != '')
            OR (username = ${username} AND username != '');`
    );
    return result.rows[0];
};

exports.getUserById = async function(id) {
    const result = await query(sql`SELECT * FROM users WHERE id = ${id};`);
    return result.rows[0];
};

exports.createUser = async function({ email, username, password }) {
    let salt, passwordHash;
    if (password) {
        let passwordObj = saltHashPassword(password);
        salt = passwordObj.salt;
        passwordHash = passwordObj.passwordHash;
    }
    const result = await query(sql`INSERT INTO users(email, username, hash, salt)
            VALUES(${email}, ${username}, ${passwordHash}, ${salt}) RETURNING *;`);
    return result.rows[0];
};
