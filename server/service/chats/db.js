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

exports.createNewChatMessage = async (chat_id, user_id, content) => {
  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO chat_message
        (chat_id, user_id, content)
      VALUES
        (${chat_id}, ${user_id}, ${content})
      RETURNING *;
    `);
    return result.rows[0];
  });
};

exports.createNewUnquotableMessage = async (chat_id, user_id, content) => {
  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO chat_message
        (chat_id, user_id, content, is_quotable)
      VALUES
        (${chat_id}, ${user_id}, ${content}, FALSE)
      RETURNING *;
    `);
    return result.rows[0];
  });
};

exports.joinChat = async (chat_id, user_id) => {
  if (!chat_id || !user_id) {
    return;
  }
  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO chat_user
        (chat_id, user_id, is_present)
      VALUES
        (${chat_id}, ${user_id}, TRUE)
      ON CONFLICT ON CONSTRAINT chat_user_pkey
      DO UPDATE SET is_present = TRUE
      RETURNING *;
    `);
    return result.rows[0];
  });
};

exports.partChat = async (chat_id, user_id) => {
  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      UPDATE chat_user
      SET is_present = FALSE
      WHERE chat_id = ${chat_id}
      AND user_id = ${user_id}
      RETURNING *;
    `);
    return result.rows[0];
  });
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

exports.getChatUserByChatId = async (id, user_id) => {
  const result = await query(sql`
    SELECT
      user_role_detail.*,
      chat_user.updated_at,
      chat_user.is_muted,
      chat_user.is_present
    FROM chat_user
    JOIN user_role_detail ON user_role_detail.id = chat_user.user_id
    WHERE chat_user.chat_id = ${id}
      AND chat_user.user_id  = ${user_id};
  `);
  return result.rows;
};

exports.getChatUsersByChatId = async id => {
  const result = await query(sql`
    SELECT
      user_role_detail.*,
      chat_user.updated_at,
      chat_user.is_muted,
      chat_user.is_present
    FROM chat_user
    JOIN user_role_detail ON user_role_detail.id = chat_user.user_id
    WHERE chat_user.chat_id = ${id};
  `);
  return result.rows;
};

exports.getChatMessagesCountByChatId = async id => {
  const result = await query(sql`
    SELECT COUNT(id) as count
    FROM chat_message
    WHERE chat_id = ${id}
  `);
  return result.rows[0].count;
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

exports.setMessageById = async (id, updates) => {
  return await withClientTransaction(async client => {
    const result = await client.query(
      updateQuery('chat_message', { id }, updates)
    );
    return result.rows[0];
  });
};

exports.getMessageById = async id => {
  const result = await query(sql`
    SELECT *
    FROM chat_message
    WHERE id = ${id}
  `);
  return result.rowCount ? result.rows[0] : null;
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
