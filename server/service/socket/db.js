const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');

exports.getRollCallByRoomKey = async function(room_key) {
  const result = await query(sql`
    SELECT user_id FROM rollcall
    WHERE room_key = ${room_key};
  `);
  return result.rows.map(({ user_id }) => user_id);
};

exports.removeRollCallByRoomKey = async function(room_key) {
  return await withClientTransaction(async client => {
    await client.query(sql`
      DELETE FROM rollcall
      WHERE room_key = ${room_key};
    `);
  });
};

exports.removeUserFromRolls = async function(user_id) {
  return await withClientTransaction(async client => {
    await client.query(sql`
      DELETE FROM rollcall WHERE user_id = ${user_id};
    `);
  });
};

exports.addUserToRoll = async function(room_key, user_id) {
  return await withClientTransaction(async client => {
    await client.query(sql`
      INSERT INTO rollcall (room_key, user_id)
      VALUES (${room_key}, ${user_id});
    `);
  });
};

exports.removeUserFromRoll = async function(room_key, user_id) {
  return await withClientTransaction(async client => {
    await client.query(sql`
      INSERT INTO rollcall (room_key, user_id)
      VALUES (${room_key}, ${user_id});
    `);
  });
};

exports.getDiscussionState = async function(room_key) {
  const result = await query(sql`
    SELECT state FROM chat_discussion
    WHERE room_key = ${room_key};
  `);
  return result.rows.length
    ? result.rows[0].state
    : null;
};

exports.setDiscussionState = async function(room_key, state) {
  return await withClientTransaction(async client => {
    await client.query(sql`
      INSERT INTO chat_discussion (room_key, state)
      VALUES (${room_key}, ${state})
      ON CONFLICT (room_key) DO UPDATE SET state = ${state};
    `);
  });
};
