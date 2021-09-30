const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');

const INVITE_STATUS = {
  PENDING: 1,
  CANCELED: 2,
  DECLINED: 3,
  ACCEPTED: 4
};

exports.INVITE_STATUS = INVITE_STATUS;

async function __getInvitesFromTable(view, user_id) {
  const result = await query(`
    SELECT *
    FROM ${view}
    WHERE
      receiver_id = ${user_id} OR sender_id = ${user_id}
    AND
      created_at > NOW() - interval '6 hours' OR expire_at > NOW()
  `);
  return result.rows;
}

async function getChatInvitesExclusive(user_id) {
  const result = await query(`
    SELECT ci.*, c.ended_at
    FROM chat_invite ci
    JOIN chat c ON c.id = ci.chat_id
    WHERE ci.receiver_id = ${user_id} OR ci.sender_id = ${user_id}
    AND c.ended_at IS NULL
    AND (ci.created_at > NOW() - interval '6 hours' OR ci.expire_at > NOW())
  `);

  // console.log(result.rows);
  return result.rows;
}

const views = ['chat_invite'];

async function __getAggregatedInvites(user_id) {
  const results = [];
  for (let view of views) {
    results.push(...(await __getInvitesFromTable(view, user_id)));
  }

  const invites = {};
  for (let result of results) {
    const key = `${result.sender_id}.${result.receiver_id}.${result.chat_id}`;
    invites[key] = {
      ...result
    };
  }
  return Object.values(invites);
}

exports.getInvites = async user_id => {
  return getChatInvitesExclusive(user_id);
};

// TODO: determine if these are necessary, if not remove.
exports.getInvitesAsReceiver = async receiver_id => {
  const invites = [];
  return invites;
};

exports.getInvitesAsSender = async sender_id => {
  const invites = [];
  return invites;
};

exports.setInvite = async (id, updates) => {
  return await withClientTransaction(async client => {
    const result = await client.query(updateQuery('invite', { id }, updates));
    return result.rows[0];
  });
};
