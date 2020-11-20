const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

async function getNotifications(req, res) {
  const notifications = await db.getNotifications();
  res.json({ notifications });
}

async function getNotificationsByAuthorId(req, res) {
  const notifications = await db.getNotificationsByAuthorId(
    req.session.user.id
  );
  res.json({ notifications });
}

async function getNotificationsStartedNotExpired(req, res) {
  const id = Number(req.params.id);
  const notifications = await db.getNotificationsStartedNotExpired(id);
  res.json({ notifications });
}

async function createNotification(req, res) {
  const {
    author_id,
    start_at = null,
    expire_at = null,
    props,
    rules,
    type
  } = req.body;

  if (!props || !rules || !type) {
    const error = new Error(
      'Creating a notification requires props, rules and a type.'
    );
    error.status = 422;
    throw error;
  }

  const notification = await db.createNotification({
    author_id,
    start_at,
    expire_at,
    props,
    rules,
    type
  });

  if (!notification) {
    const error = new Error('Notification could not be created.');
    error.status = 422;
    throw error;
  }

  res.json({ notification });
}

async function setNotificationAck(req, res) {
  const id = Number(req.body.id);

  if (!id) {
    const error = new Error(
      'Notification acknowledgement requires a notification id.'
    );
    error.status = 422;
    throw error;
  }

  const user_id = Number(req.session.user_id);
  const ack = await db.setNotificationAck(id, user_id);

  if (!ack) {
    const error = new Error('Notification could not be acknowledged.');
    error.status = 422;
    throw error;
  }

  res.json({ ack });
}

async function getNotificationById(req, res) {
  const id = Number(req.params.id);
  const notification = await db.getNotificationById(id);
  res.json({ notification });
}

async function setNotificationById(req, res) {
  const id = Number(req.params.id);
  const {
    deleted_at = null,
    expire_at = null,
    start_at = null,
    props = null,
    rules = null,
    type = null
  } = req.body;

  const updates = {};

  if (deleted_at) {
    updates.deleted_at = deleted_at;
  }

  if (expire_at) {
    updates.expire_at = expire_at;
  }

  if (start_at) {
    updates.start_at = start_at;
  }

  if (props) {
    updates.props = props;
  }

  if (rules) {
    updates.rules = rules;
  }

  if (type) {
    updates.type = type;
  }

  let notification;

  if (Object.entries(updates).length) {
    notification = await db.setNotificationById(id, updates);
  } else {
    notification = await db.getNotificationById(id);
  }

  res.json({ notification });
}

exports.getNotifications = asyncMiddleware(getNotifications);
exports.getNotificationsByAuthorId = asyncMiddleware(
  getNotificationsByAuthorId
);
exports.getNotificationsStartedNotExpired = asyncMiddleware(
  getNotificationsStartedNotExpired
);
exports.createNotification = asyncMiddleware(createNotification);
exports.getNotificationById = asyncMiddleware(getNotificationById);
exports.setNotificationById = asyncMiddleware(setNotificationById);
exports.setNotificationAck = asyncMiddleware(setNotificationAck);
