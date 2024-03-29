const { parse } = require('node-html-parser');
const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');
const { INVITE_STATUS } = require('../invites/db');
const scenariosdb = require('../scenarios/db');
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

exports.getChatInvites = async chat_id => {
  const result = await query(sql`
    SELECT *
    FROM chat_invite
    WHERE expire_at IS NULL
    AND chat_id = ${chat_id}
  `);
  return result.rows;
};

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
  //
  // Previously:
  // return result.rowCount ? result.rows[0] : null;
  //

  const chat = result.rowCount ? result.rows[0] : null;

  if (chat) {
    const users = await this.getChatUsersByChatId(id);
    const usersById = users.reduce(
      (accum, user) => ({
        ...accum,
        [user.id]: user
      }),
      {}
    );
    return {
      ...chat,
      users,
      usersById
    };
  }
  return chat;
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

exports.checkRoster = async (chat_id, scenario_id) => {
  const chat = await this.getChat(chat_id);
  const scenario = await scenariosdb.getScenario(scenario_id);
  return scenario.personas.every(p =>
    chat.users.find(u => u.persona_id === p.id)
  );
};

exports.joinOrCreateChatFromPool = async (
  cohort_id,
  scenario_id,
  persona_id,
  user_id
) => {
  // Check if this user is actually already a HOST
  //    in a chat that matches the requirements of this request
  let result = await query(`
    SELECT chat.*
    FROM chat
    JOIN chat_user cu ON cu.chat_id = chat.id
    WHERE chat.ended_at IS NULL
    AND chat.host_id = ${user_id}
    AND cu.persona_id = ${persona_id}
    AND chat.scenario_id = ${scenario_id}
    ${cohort_id ? `AND chat.cohort_id = ${cohort_id}` : ''}
    ORDER BY chat.id ASC
    LIMIT 1
  `);

  if (result.rowCount) {
    const existing = result.rows[0];
    const isCompleteRoster = await this.checkRoster(
      existing.id,
      existing.scenario_id
    );
    return isCompleteRoster ? this.getChat(existing.id) : null;
  }

  // Check if this user is already in any chat that matches the
  // requirements of this requst
  result = await query(`
    SELECT chat.*
    FROM chat
    JOIN chat_user cu ON cu.chat_id = chat.id
    WHERE chat.ended_at IS NULL
    AND cu.user_id = ${user_id}
    AND cu.persona_id = ${persona_id}
    AND chat.scenario_id = ${scenario_id}
    ${cohort_id ? `AND chat.cohort_id = ${cohort_id}` : ''}
    ORDER BY chat.id ASC
    LIMIT 1
  `);

  if (result.rowCount) {
    const existing = result.rows[0];
    const isCompleteRoster = await this.checkRoster(
      existing.id,
      existing.scenario_id
    );

    return isCompleteRoster ? this.getChat(existing.id) : null;
  }

  // Find a chat that has this persona available
  result = await query(`
    WITH available AS (
      SELECT chat.id AS chat_id, persona.id AS persona_id, persona.name
      FROM scenario_persona sp
      JOIN chat USING(scenario_id)
      JOIN persona ON persona.id = sp.persona_id
      WHERE
        chat.ended_at IS NULL
      AND
        chat.is_open = TRUE
      AND persona.id NOT IN (
        SELECT persona_id
        FROM chat_user
        WHERE chat_id = chat.id
        AND ended_at IS NULL
        AND persona_id IS NOT NULL
      )
      AND persona.id = ${persona_id}
      AND sp.scenario_id = ${scenario_id}
      ${cohort_id ? `AND chat.cohort_id = ${cohort_id}` : ''}
      ORDER BY chat.id ASC
      LIMIT 1
    )
    INSERT INTO chat_user (chat_id, user_id, is_present, persona_id)
    SELECT chat_id, ${user_id} AS user_id, true AS is_present, persona_id
    FROM available
    ON CONFLICT DO NOTHING
    RETURNING *;
  `);

  const is_open = true;
  const is_present = true;

  // If no match was found, then create a chat and return
  // null, which will move the user into "waiting"
  if (!result.rowCount) {
    const created = await this.createChat(
      user_id,
      scenario_id,
      cohort_id,
      is_open
    );

    // TODO: reduce duplication
    await query(`
      INSERT INTO chat_user
        (chat_id, user_id, is_present, persona_id)
      VALUES
        (${created.id}, ${user_id}, ${is_present}, ${persona_id})
      ON CONFLICT DO NOTHING;
    `);

    return null;
  }

  // TODO: reduce duplication
  await query(`
    INSERT INTO chat_user
      (chat_id, user_id, is_present, persona_id)
    VALUES
      (${result.rows[0].chat_id}, ${user_id}, ${is_present}, ${persona_id})
    ON CONFLICT DO NOTHING;
  `);

  const chat = await this.getChat(result.rows[0].chat_id);
  const isCompleteRoster = await this.checkRoster(chat.id, scenario_id);

  return isCompleteRoster ? chat : null;
};

exports.leaveChatPool = async (cohort_id, scenario_id, persona_id, user_id) => {
  // Check if this user is actually already a HOST
  //    in a chat that matches the requirements of this request
  let result = await query(`
    SELECT chat.*
    FROM chat
    JOIN chat_user cu ON cu.chat_id = chat.id
    WHERE chat.ended_at IS NULL
    AND chat.host_id = ${user_id}
    AND cu.persona_id = ${persona_id}
    AND chat.scenario_id = ${scenario_id}
    ${cohort_id ? `AND chat.cohort_id = ${cohort_id}` : ''}
    ORDER BY chat.id ASC
    LIMIT 1
  `);

  if (result.rowCount) {
    const chat_id = result.rows[0].id;

    await query(`
      UPDATE chat
      SET
        deleted_at = NOW(),
        ended_at = NOW()
      WHERE id = ${chat_id}
    `);

    await query(`
      UPDATE chat_user
      SET
        is_present = FALSE,
        ended_at = NOW()
      WHERE chat_id = ${chat_id}
      AND user_id = ${user_id};
    `);

    return true;
  }

  return false;
};

exports.joinChat = async (chat_id, user_id, persona_id = null) => {
  if (!chat_id || !user_id) {
    return;
  }
  return await withClientTransaction(async client => {
    const available = await client.query(sql`
      SELECT persona.id AS id, persona.name
      FROM scenario_persona sp
      JOIN chat USING(scenario_id)
      JOIN persona ON persona.id = sp.persona_id
      WHERE chat.id = ${chat_id}
      AND persona.id NOT IN (
        SELECT persona_id
        FROM chat_user
        WHERE chat_id = ${chat_id}
        AND persona_id IS NOT NULL
      )
    `);

    // If a persona_id exists, but there are no
    // persona roles available, then this user cannot
    // join the room.
    if (persona_id && !available.rowCount) {
      return null;
    }

    const chat = await this.getChat(chat_id);

    // If this chat is associated with a scenario, then mark
    // all participants as present.
    // Otherwise, only mark them present if persona_id is set.
    const is_present = chat.scenario_id === null || persona_id !== null;

    // There are persona roles, proceed with joining this room
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
      return chat;
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

exports.getChatUsersSharedResponses = async (id, response_id, list) => {
  const result = await query(`
    SELECT DISTINCT ON (user_id) *
    FROM (
      SELECT * FROM (
          SELECT *
          FROM run_response_view
          ORDER BY id DESC
      ) AS rrv
      WHERE run_id IN (
        SELECT run_id FROM run_chat
        WHERE chat_id = ${id}
      )
      AND response_id = '${response_id}'
      AND user_id IN (${list.join(',')})
    ) AS x
  `);
  return result.rows;
};

const normalizeTranscriptRecord = record => {
  const { textContent } = parse(record.content);
  return {
    ...record,
    textContent
  };
};

const isRelevant = record => {
  if (record.is_joinpart && record.deleted_at) {
    return false;
  }
  return true;
};

exports.getChatTranscriptsByChatId = async chat_id => {
  // Previously:
  // const result = await query(sql`
  //   WITH ci AS (
  //     SELECT chat_id, run_id
  //     FROM run_chat
  //     WHERE chat_id = ${chat_id}
  //     ORDER BY chat_id ASC
  //   )
  //   SELECT DISTINCT ON (cma.id) *
  //   FROM chat_message_archives cma
  //   JOIN ci ON ci.chat_id = cma.chat_id
  // `);
  const result = await query(sql`
    WITH ci AS (
      SELECT chat_id, run_id
      FROM run_chat
      WHERE chat_id = ${chat_id}
      ORDER BY chat_id ASC
    )
    SELECT DISTINCT ON (cma.id)
      cma.id,
      ci.run_id,
      r.scenario_id,
      cma.chat_id,
      cma.user_id,
      cma.content,
      cma.created_at,
      cma.updated_at,
      cma.deleted_at,
      cma.is_quotable,
      cma.is_joinpart,
      cma.response_id,
      cma.recipient_id,
      cma.role_persona_id,
      cma.role_persona_name,
      cma.role_persona_description
    FROM chat_message_archives cma
    JOIN ci ON ci.chat_id = cma.chat_id
    JOIN run r ON r.id = ci.run_id;
  `);

  const records = result.rowCount
    ? result.rows.map(normalizeTranscriptRecord)
    : [];

  return records;
};

exports.getChatTranscriptsByCohortId = async cohort_id => {
  // Previously:
  // const result = await query(sql`
  //   WITH ci AS (
  //     SELECT rc.chat_id, rc.run_id
  //     FROM cohort_run cr
  //     JOIN run_chat rc ON rc.run_id = cr.run_id
  //     WHERE cr.cohort_id = ${cohort_id}
  //     ORDER BY rc.chat_id ASC
  //   )
  //   SELECT DISTINCT ON (cma.id) *
  //   FROM chat_message_archives cma
  //   JOIN ci ON ci.chat_id = cma.chat_id

  // `);
  const result = await query(sql`
    WITH ci AS (
      SELECT rc.chat_id, rc.run_id
      FROM cohort_run cr
      JOIN run_chat rc ON rc.run_id = cr.run_id
      WHERE cr.cohort_id = ${cohort_id}
      ORDER BY rc.chat_id ASC
    )
    SELECT DISTINCT ON (cma.id)
      cma.id,
      ci.run_id,
      r.scenario_id,
      cma.chat_id,
      cma.user_id,
      cma.content,
      cma.created_at,
      cma.updated_at,
      cma.deleted_at,
      cma.is_quotable,
      cma.is_joinpart,
      cma.response_id,
      cma.recipient_id,
      cma.role_persona_id,
      cma.role_persona_name,
      cma.role_persona_description
    FROM chat_message_archives cma
    JOIN ci ON ci.chat_id = cma.chat_id
    JOIN run r ON r.id = ci.run_id
  `);

  const records = result.rowCount
    ? result.rows.map(normalizeTranscriptRecord)
    : [];

  return records;
};

exports.getChatTranscriptsByScenarioId = async scenario_id => {
  // Previously:
  // const result = await query(sql`
  //   WITH rs AS (
  //     SELECT chat_id, run_id
  //     FROM run_chat rc
  //     JOIN (
  //       SELECT id
  //       FROM run
  //       WHERE scenario_id = ${scenario_id}
  //     ) r ON rc.run_id = r.id
  //   )
  //   SELECT DISTINCT ON (cma.id) *
  //   FROM chat_message_archives cma
  //   JOIN rs ON rs.chat_id = cma.chat_id;
  // `);
  const result = await query(sql`
    WITH rs AS (
      SELECT chat_id, run_id
      FROM run_chat rc
      JOIN (
        SELECT id
        FROM run
        WHERE scenario_id = ${scenario_id}
      ) r ON rc.run_id = r.id
    )
    SELECT DISTINCT ON (cma.id)
      cma.id,
      rs.run_id,
      r.scenario_id,
      cma.chat_id,
      cma.user_id,
      cma.content,
      cma.created_at,
      cma.updated_at,
      cma.deleted_at,
      cma.is_quotable,
      cma.is_joinpart,
      cma.response_id,
      cma.recipient_id,
      cma.role_persona_id,
      cma.role_persona_name,
      cma.role_persona_description
    FROM chat_message_archives cma
    JOIN rs ON rs.chat_id = cma.chat_id
    JOIN run r ON r.id = rs.run_id;
  `);

  const records = result.rowCount
    ? result.rows.map(normalizeTranscriptRecord)
    : [];

  return records;
};

exports.getChatTranscriptsByRunId = async run_id => {
  // Previously:
  // const result = await query(sql`
  //   WITH ci AS (
  //     SELECT DISTINCT chat_id, run_id
  //     FROM run_chat
  //     WHERE run_id = ${run_id}
  //     ORDER BY chat_id ASC
  //   )
  //   SELECT DISTINCT ON (cma.id) *
  //   FROM chat_message_archives cma
  //   JOIN ci ON ci.chat_id = cma.chat_id
  // `);
  const result = await query(sql`
    WITH ci AS (
      SELECT DISTINCT chat_id, run_id
      FROM run_chat
      WHERE run_id = ${run_id}
      ORDER BY chat_id ASC
    )
    SELECT DISTINCT ON (cma.id)
      cma.id,
      ci.run_id,
      r.scenario_id,
      cma.chat_id,
      cma.user_id,
      cma.content,
      cma.created_at,
      cma.updated_at,
      cma.deleted_at,
      cma.is_quotable,
      cma.is_joinpart,
      cma.response_id,
      cma.recipient_id,
      cma.role_persona_id,
      cma.role_persona_name,
      cma.role_persona_description
    FROM chat_message_archives cma
    JOIN ci ON ci.chat_id = cma.chat_id
    JOIN run r ON r.id = ci.run_id;
  `);

  const records = result.rowCount
    ? result.rows.map(normalizeTranscriptRecord)
    : [];

  return records;
};
