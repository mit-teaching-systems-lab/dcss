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

async function createChat(req, res) {
  const host_id = req.session.user.id;
  const { lobby_id } = req.body;

  if (!host_id || !lobby_id) {
    const error = new Error('Creating a chat requires a host and lobby.');
    error.status = 422;
    throw error;
  }

  const chat = await db.createChat(host_id, lobby_id);

  if (!chat) {
    const error = new Error('Chat could not be created.');
    error.status = 409;
    throw error;
  }

  res.json({ chat });
}

async function linkChatToRun(req, res) {
  const id = Number(req.params.id);
  const run_id = Number(req.params.run_id);

  try {
    await db.linkChatToRun(id, run_id);
    const chat = await db.getChatById(id);
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

exports.getChats = asyncMiddleware(getChats);
exports.getChatsByUserId = asyncMiddleware(getChatsByUserId);
exports.getChatMessagesByChatId = asyncMiddleware(getChatMessagesByChatId);
exports.getChatMessagesCountByChatId = asyncMiddleware(
  getChatMessagesCountByChatId
);
exports.getChatUsersByChatId = asyncMiddleware(getChatUsersByChatId);
exports.createChat = asyncMiddleware(createChat);
exports.getChatById = asyncMiddleware(getChatById);
exports.linkChatToRun = asyncMiddleware(linkChatToRun);
exports.setChatById = asyncMiddleware(setChatById);
exports.getMessageById = asyncMiddleware(getMessageById);
exports.setMessageById = asyncMiddleware(setMessageById);
