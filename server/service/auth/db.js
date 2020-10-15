const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');
const { saltHashPassword } = require('../../util/pwHash');

async function getUserByProps({ id, username, email }) {
  // This query looks a little ugly, but it allows us to pass in empty
  // stuff for id, username or email!
  // SELECT * FROM users WHERE id = ${id}
  const result = await query(sql`
    SELECT * FROM users WHERE id = ${id}
    OR (username = ${username} AND username != '')
    OR (email = ${email} AND email != '');
  `);
  return result.rows[0];
}

async function getUserById(id) {
  const result = await query(sql`
    SELECT * FROM user_role_detail WHERE id = ${id}
  `);
  return result.rows[0];
}

async function createUser({ email, username, password }) {
  let salt, passwordHash;
  if (password) {
    let passwordObj = saltHashPassword(password);
    salt = passwordObj.salt;
    passwordHash = passwordObj.passwordHash;
  }

  const {
    rows: [user]
  } = await query(sql`
        INSERT INTO users(email, username, hash, salt)
        VALUES(${email}, ${username}, ${passwordHash}, ${salt})
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
      `);

  if (user && user.id) {
    // All new users are a "participant" by default.
    await query(sql`
      INSERT INTO user_role (role, user_id)
      VALUES('participant', ${user.id})
      RETURNING *;
    `);
    return getUserById(user.id);
  } else {
    const user = getUserByProps({ username });
    return getUserById(user.id);
  }
}

async function updateUser(id, updates) {
  const prepared = Object.entries(updates).reduce((accum, [key, value]) => {
    if (key === 'password') {
      let { passwordHash: hash, salt } = saltHashPassword(value);
      accum.hash = hash;
      accum.salt = salt;
    } else {
      accum[key] = value;
    }
    return accum;
  }, {});

  const {
    rows: [user]
  } = await query(updateQuery('users', { id }, prepared));

  return getUserById(user.id);
}

async function getUserRoles(id) {
  const result = await query(sql`
    SELECT ARRAY_AGG(role) AS roles
    FROM user_role
    WHERE user_id = ${id};
  `);
  const roles = result.rows.length
    ? result.rows[0].roles
    : [];

  return { roles };
};

exports.getUserByProps = getUserByProps;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.getUserRoles = getUserRoles;
