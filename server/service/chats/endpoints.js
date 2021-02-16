const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

async function getChats(req, res) {
  const chats = await db.getChats();
  res.json({ chats });
}

async function getChatsByUserId(req, res) {
  const chats = await db.getChatsByUserId(req.session.user.id);
  res.json({ chats });
}

async function getChatsByCohortId(req, res) {
  const results = await db.getChatsByCohortId(Number(req.params.id));
  const chats = [];
  for (const result of results) {
    const users = await db.getChatUsersByChatId(result.id);
    const usersById = users.reduce(
      (accum, user) => ({
        ...accum,
        [user.id]: user
      }),
      {}
    );

    chats.push({
      ...result,
      users,
      usersById
    });
  }

  res.json({ chats });
}

// async function linkRunToChat(req, res) {
//   const id = Number(req.params.id);
//   const run_id = Number(req.params.run_id);

//   try {
//     await db.linkRunToChat(id, run_id);
//     const chat = await db.getChatById(id);
//     res.json({ chat });
//   } catch (e) {
//     const error = new Error(`Chat could not be linked. ${e.message}`);
//     error.status = 409;
//     throw error;
//   }
// }

async function newOrExistingChat(req, res) {
  const host_id = req.session.user.id;
  const scenario_id = Number(req.params.scenario_id || req.body.scenario_id);
  const cohort_id = Number(req.params.cohort_id || req.body.cohort_id) || null;
  const is_open = req.body.is_open || false;

  if (!host_id || !scenario_id) {
    const error = new Error('Creating a chat requires a host and a scenario.');
    error.status = 422;
    throw error;
  }

  const identifiers = {
    scenario_id
  };

  if (cohort_id) {
    identifiers.cohort_id = cohort_id;
  }

  let chat = await db.getChatByIdentifiers(host_id, identifiers);

  if (!chat) {
    chat = await db.createChat(host_id, scenario_id, cohort_id, is_open);
  } else {
    if (chat.is_open !== is_open) {
      chat = await db.setChatById(chat.id, { is_open });
    }
  }

  if (!chat) {
    const error = new Error('Chat could not be created.');
    error.status = 409;
    throw error;
  }

  await db.joinChat(chat.id, host_id);

  //
  //
  // TODO: Determine if this should use `getLinkedChatUsersByChatId`
  //
  //
  const users = await db.getChatUsersByChatId(chat.id);
  const usersById = users.reduce(
    (accum, user) => ({
      ...accum,
      [user.id]: user
    }),
    {}
  );

  chat = {
    ...chat,
    users,
    usersById
  };

  console.log('..............................................');
  console.log();
  console.log();
  console.log();

  console.log(chat);

  console.log();
  console.log();
  console.log();
  console.log('..............................................');

  res.json({ chat });
}

async function createChat(req, res) {
  const host_id = req.session.user.id;
  const { cohort_id = null, is_open = false, scenario_id } = req.body;

  if (!req.session.user.id || !scenario_id) {
    const error = new Error('Creating a chat requires a host and a scenario.');
    error.status = 422;
    throw error;
  }

  let chat = await db.createChat(host_id, cohort_id, scenario_id, is_open);

  if (!chat) {
    const error = new Error('Chat could not be created.');
    error.status = 409;
    throw error;
  }

  res.json({ chat });
}

async function createChatInvite(req, res) {
  const id = Number(req.params.id);

  if (!id || !req.session.user.id || !req.body.invite) {
    const error = new Error(
      'Creating a chat invite requires a chat, host and invite.'
    );
    error.status = 422;
    throw error;
  }

  const { user, persona = { id: null } } = req.body.invite;

  const invite = await db.createChatInvite(
    id,
    req.session.user.id,
    user.id,
    persona.id
  );

  if (!invite) {
    const error = new Error('Chat invite could not be created.');
    error.status = 409;
    throw error;
  }

  res.json({ invite });
}

async function linkRunToChat(req, res) {
  const id = Number(req.params.id);
  const user_id = req.session.user.id;
  const run_id = Number(req.params.run_id);
  try {
    const invite = await db.getChatInviteForUser(id, user_id);
    if (!invite) {
      throw new Error('No invite for this user.');
    }
    await db.linkRunToChat(id, run_id, user_id);

    // TODO: Consolidate the calls to getChatById && getChatUsersByChatId
    const result = await db.getChatById(id);
    const users = await db.getChatUsersByChatId(result.id);
    const usersById = users.reduce(
      (accum, user) => ({
        ...accum,
        [user.id]: user
      }),
      {}
    );

    const chat = {
      ...result,
      users,
      usersById
    };
    res.json({ chat });
  } catch (e) {
    const error = new Error(`Chat could not be linked. ${e.message}`);
    error.status = 409;
    throw error;
  }
}

async function getChatById(req, res) {
  const id = Number(req.params.id);
  const chat = await db.getChatById(id);
  res.json({ chat });
}

async function getChatMessagesByChatId(req, res) {
  const id = Number(req.params.id);
  const messages = await db.getChatMessagesByChatId(id);
  res.json({ messages });
}

async function getChatUsersByChatId(req, res) {
  const id = Number(req.params.id);
  const users = await db.getChatUsersByChatId(id);
  res.json({ users });
}

async function getLinkedChatUsersByChatId(req, res) {
  const id = Number(req.params.id);
  const users = await db.getLinkedChatUsersByChatId(id);
  res.json({ users });
}

async function getChatMessagesCountByChatId(req, res) {
  const id = Number(req.params.id);
  const count = await db.getChatMessagesCountByChatId(id);
  res.json({ count });
}

async function setChatById(req, res) {
  const id = Number(req.params.id);
  const { deleted_at = null } = req.body;

  const updates = {};

  if (deleted_at) {
    updates.deleted_at = deleted_at;
  }

  let chat;

  if (Object.entries(updates).length) {
    chat = await db.setChatById(id, updates);
  } else {
    chat = await db.getChatById(id);
  }

  res.json({ chat });
}

async function getMessageById(req, res) {
  const id = Number(req.params.id);
  const message = await db.getMessageById(id);
  res.json({ message });
}

async function setMessageById(req, res) {
  const id = Number(req.params.id);
  const {
    // NOTE: for now there is only a delete option.
    // Editing messages should create "backup" messages
    // containing the original contents.
    deleted_at = null
  } = req.body;

  const updates = {};

  if (deleted_at) {
    updates.deleted_at = deleted_at;
  }

  let message;

  if (Object.entries(updates).length) {
    message = await db.setMessageById(id, updates);
  } else {
    message = await db.setMessageById(id);
  }

  res.json({ message });
}

async function joinChat(req, res) {
  const chat = await db.joinChat(
    Number(req.params.id),
    req.session.user.id,
    req.body.persona.id
  );
  res.json({ chat });
}

exports.joinChat = asyncMiddleware(joinChat);
exports.getChats = asyncMiddleware(getChats);
exports.getChatsByUserId = asyncMiddleware(getChatsByUserId);
exports.getChatsByCohortId = asyncMiddleware(getChatsByCohortId);
exports.getChatMessagesByChatId = asyncMiddleware(getChatMessagesByChatId);
exports.getChatMessagesCountByChatId = asyncMiddleware(
  getChatMessagesCountByChatId
);
// exports.getChatInvitesByChatId = asyncMiddleware(getChatInvitesByChatId);
// exports.getChatInvitesByReceiverId = asyncMiddleware(getChatInvitesByReceiverId);
// exports.getChatInvitesBySenderId = asyncMiddleware(getChatInvitesBySenderId);
exports.getChatUsersByChatId = asyncMiddleware(getChatUsersByChatId);
exports.getLinkedChatUsersByChatId = asyncMiddleware(
  getLinkedChatUsersByChatId
);
exports.newOrExistingChat = asyncMiddleware(newOrExistingChat);
exports.createChat = asyncMiddleware(createChat);
exports.createChatInvite = asyncMiddleware(createChatInvite);
// exports.setChatInviteById = asyncMiddleware(setChatInviteById);
exports.getChatById = asyncMiddleware(getChatById);
exports.linkRunToChat = asyncMiddleware(linkRunToChat);
exports.setChatById = asyncMiddleware(setChatById);
exports.getMessageById = asyncMiddleware(getMessageById);
exports.setMessageById = asyncMiddleware(setMessageById);
