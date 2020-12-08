const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');

exports.createChat = async (host_id, lobby_id) => {
  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO chat (host_id, lobby_id)
      VALUES (${host_id}, ${lobby_id})
      ON CONFLICT DO NOTHING
      RETURNING *
    `);

    return result.rowCount;
  });
};

exports.linkChatToRun = async (chat_id, run_id) => {
  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO run_chat (run_id, chat_id)
      VALUES (${run_id}, ${chat_id})
      ON CONFLICT DO NOTHING
      RETURNING *
    `);

    return result.rowCount;
  });
};

exports.getChatById = async id => {
  const result = await query(sql`
    SELECT *
    FROM chat
    WHERE id = ${id}
  `);
  return result.rowCount ? result.rows[0] : null;
};

exports.getChatMessagesByChatId = async id => {
  const result = await query(sql`
    SELECT *
    FROM chat_message
    WHERE chat_id = ${id}
    ORDER BY id ASC
  `);
  return result.rows;
};

exports.getChatsByUserId = async user_id => {
  const result = await query(sql`
    SELECT *
    FROM chat
    JOIN chat_user ON chat_user.chat_id = chat.id
    WHERE chat.ended_at IS NULL
    AND chat_user.user_id = ${user_id}
    ORDER BY id ASC
  `);

  return result.rows;
};

exports.getChats = async () => {
  const result = await query(sql`
    SELECT *
    FROM chat
    WHERE ended_at IS NULL
    ORDER BY id ASC
  `);

  return result.rows;
};

exports.setChatById = async (id, updates) => {
  return await withClientTransaction(async client => {
    const result = await client.query(updateQuery('chat', { id }, updates));
    return result.rows[0];
  });
};

exports.deleteChatById = async id => {
  return await withClientTransaction(async client => {
    const result = await query(sql`
      UPDATE chat
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `);
    return result.rows[0];
  });
};
