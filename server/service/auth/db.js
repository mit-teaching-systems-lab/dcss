const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');
const { saltHashPassword } = require('../../util/pwHash');

async function getUserByProps({ id, username, email }) {
  // This query looks a little ugly, but it allows us to pass in empty stuff for id, username or email!
  const result = await query(
    sql`SELECT * FROM users WHERE id = ${id}
            OR (username = ${username} AND username != '')
            OR (email = ${email} AND email != '');`
  );
  return result.rows[0];
}

exports.getUserByProps = getUserByProps;

exports.getUserForClientByProps = async function(props) {
  let { id, email, username } = await getUserByProps(props);

  return {
    id,
    email,
    username
  };
};

exports.createUser = async function({ email, username, password }) {
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
    return user;
  } else {
    return getUserByProps({ username });
  }
};

exports.updateUser = async function(id, updates) {
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

  return user;
};
