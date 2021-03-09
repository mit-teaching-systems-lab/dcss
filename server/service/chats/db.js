const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');
const { INVITE_STATUS } = require('../invites/db');
const sessiondb = require('../session/db');

exports.getChatByIdentifiers = async (host_id, identifiers) => {
  const { scenario_id, cohort_id = null } = identifiers;

  let lookup = `
    SELECT *
    FROM chat
    WHERE ended_at IS NULL
    AND host_id = ${host_id}
    AND scenario_id = ${scenario_id}
  `;

  if (cohort_id) {
    lookup += `AND cohort_id = ${cohort_id}`;
  } else {
    lookup += `AND cohort_id IS NULL`;
  }

  const result = await query(lookup);

  return result.rows[0];
};

exports.createChat = async (
  host_id,
  scenario_id,
  cohort_id,
  is_open = false
) => {
  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO chat (host_id, scenario_id, cohort_id, is_open)
      VALUES (${host_id}, ${scenario_id}, ${cohort_id}, ${is_open})
      ON CONFLICT DO NOTHING
      RETURNING *
    `);

    return result.rows[0];
  });
};

exports.createChatInvite = async (
  chat_id,
  sender_id,
  receiver_id,
  persona_id = null
) => {
  const props = {
    chat_id,
    persona_id
  };

  const result = await query(sql`
    SELECT *
    FROM invite
    WHERE sender_id = ${sender_id}
    AND receiver_id = ${receiver_id}
    AND props = ${props}
    AND status_id = ${INVITE_STATUS.ACCEPTED}
  `);

  // If the user has already accepted this invite,
  // we shouldn't continue with the upsert below.
  if (result.rowCount) {
    return result.rows[0];
  }

  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO invite
        (sender_id, receiver_id, props)
      VALUES
        (${sender_id}, ${receiver_id}, ${props})
      ON CONFLICT ON CONSTRAINT sender_receiver_props
      DO
        UPDATE SET status_id = 1
        WHERE invite.sender_id = ${sender_id}
        AND invite.receiver_id = ${receiver_id}
        AND invite.props = ${props}
      RETURNING *;
    `);

    return result.rows[0];
  });
};

// CREATE UNIQUE INDEX run_id_response_id on run_response (run_id, response_id);

// TODO: merge this and the following function
exports.getChatInviteForUser = async (id, user_id) => {
  const result = await query(sql`
    SELECT *
    FROM chat_invite
    WHERE expire_at IS NULL
    AND
      receiver_id = ${user_id} OR sender_id = ${user_id}
    AND
      chat_id = ${id}
  `);
  return result.rows;
};

exports.linkRunToChat = async (chat_id, run_id, user_id) => {
  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO run_chat (run_id, chat_id, user_id)
      VALUES (${run_id}, ${chat_id}, ${user_id})
      ON CONFLICT DO NOTHING
      RETURNING *
    `);

    return result.rows[0] || null;
  });
};

exports.getChat = async id => {
  const result = await query(sql`
    SELECT *
    FROM chat
    WHERE id = ${id}
  `);
  return result.rowCount ? result.rows[0] : null;
};

exports.createNewChatMessage = async (
  chat_id,
  user_id,
  content,
  response_id
) => {
  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO chat_message
        (chat_id, user_id, content, response_id)
      VALUES
        (${chat_id}, ${user_id}, ${content}, ${response_id})
      RETURNING *;
    `);
    return result.rows[0];
  });
};

exports.insertNewAgentMessage = async (
  chat_id,
  user_id,
  message,
  response_id,
  recipient_id
) => {
  return await withClientTransaction(async client => {
    const recipient = await sessiondb.getUserById(recipient_id);

    const content = `
      <p>@${recipient.personalname || recipient.username}: ${message}</p>
    `.trim();

    const result = await client.query(sql`
      INSERT INTO chat_message
        (chat_id, user_id, content, response_id, recipient_id)
      VALUES
        (${chat_id}, ${user_id}, ${content}, ${response_id}, ${recipient_id})
      RETURNING *;
    `);
    return result.rows[0];
  });
};

exports.insertNewUnquotableMessage = async (chat_id, user_id, content) => {
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

exports.insertNewJoinPartMessage = async (chat_id, user_id, message) => {
  const content = `
    <p class="join-part-slide">${message}</p>
  `.trim();

  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO chat_message
        (chat_id, user_id, content, is_quotable, is_joinpart)
      VALUES
        (${chat_id}, ${user_id}, ${content}, FALSE, TRUE)
      RETURNING *;
    `);
    return result.rows[0];
  });
};

exports.updateJoinPartMessages = async (chat_id, user_id, updates) => {
  return await withClientTransaction(async client => {
    const result = await client.query(
      updateQuery(
        'chat_message',
        { chat_id, user_id, is_joinpart: true },
        updates
      )
    );
    return result.rows;
  });
};

exports.joinChat = async (chat_id, user_id, persona_id = null) => {
  if (!chat_id || !user_id) {
    return;
  }
  return await withClientTransaction(async client => {
    const is_present = persona_id !== null;
    const result = await client.query(sql`
      INSERT INTO chat_user
        (chat_id, user_id, is_present, persona_id)
      VALUES
        (${chat_id}, ${user_id}, ${is_present}, ${persona_id})
      ON CONFLICT ON CONSTRAINT chat_user_pkey
      DO
        UPDATE SET is_present = TRUE, persona_id = ${persona_id}
      RETURNING *;
    `);

    if (result.rowCount) {
      return this.getChat(chat_id);
    }
    return null;
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
    AND deleted_at IS NULL
    ORDER BY id ASC
  `);
  return result.rows;
};

exports.getChatUserByChatId = async (id, user_id) => {
  const result = await query(sql`
    SELECT
      user_role_detail.*,
      chat_user.updated_at,
      chat_user.persona_id,
      chat_user.is_muted,
      chat_user.is_present
    FROM chat_user
    JOIN user_role_detail ON user_role_detail.id = chat_user.user_id
    WHERE chat_user.chat_id = ${id}
      AND chat_user.user_id  = ${user_id};
  `);
  return result.rows[0];
};

exports.getChatUsersByChatId = async id => {
  const result = await query(sql`
    SELECT
      user_role_detail.*,
      chat_user.updated_at,
      chat_user.persona_id,
      chat_user.is_muted,
      chat_user.is_present
    FROM chat_user
    JOIN user_role_detail ON user_role_detail.id = chat_user.user_id
    WHERE chat_user.chat_id = ${id}
    AND chat_user.ended_at IS NULL;
  `);
  return result.rows;
};

exports.getLinkedChatUsersByChatId = async id => {
  const result = await query(sql`
    SELECT
      user_role_detail.*,
      chat_user.updated_at,
      chat_user.persona_id,
      chat_user.is_muted,
      chat_user.is_present
    FROM chat_user
    JOIN run_chat ON run_chat.user_id = chat_user.user_id AND run_chat.chat_id = ${id}
    JOIN user_role_detail ON user_role_detail.id = chat_user.user_id
    WHERE chat_user.chat_id = ${id}
    AND chat_user.ended_at IS NULL;
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

exports.getChatsByCohortId = async cohort_id => {
  const result = await query(sql`
    SELECT *
    FROM chat
    WHERE cohort_id = ${cohort_id}
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

exports.setChat = async (id, updates) => {
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

exports.archiveChatMessagesByChatId = async id => {
  // WITH rows AS (
  //    DELETE FROM chat_message
  //    WHERE
  //       chat_id = ${id}
  //    RETURNING *
  // )
  // INSERT INTO chat_message_archive (SELECT * FROM rows);
};
