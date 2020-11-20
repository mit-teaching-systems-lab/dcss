const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');

exports.createNotification = async ({
  start_at,
  expire_at,
  props,
  rules,
  type
}) => {
  return await withClientTransaction(async client => {
    const create = await client.query(sql`
      INSERT INTO notification (start_at, expire_at, props, rules, type)
      VALUES (${start_at}, ${expire_at}, ${props}, ${rules}, ${type})
      RETURNING *
    `);

    if (!create.rowCount) {
      return null;
    }

    return create.rows[0];
  });
};

exports.getNotificationById = async id => {
  const result = await query(sql`
    SELECT *
    FROM notification
    WHERE id = ${id}
  `);
  return result.rowCount ? result.rows[0] : null;
};

exports.getNotificationsStartedNotExpired = async (start_at, expire_at) => {
  const result = await query(sql`
    SELECT *
    FROM notification
    WHERE start_at >= ${start_at}
      AND expire_at <= ${expire_at}
      AND deleted_at IS NULL
    ORDER BY id ASC;
  `);

  return result.rows;
};

exports.getNotifications = async () => {
  const result = await query(sql`
    SELECT *
    FROM notification
    WHERE id NOT IN (
      SELECT notification_id as id FROM notification_ack
      WHERE notification_ack.user_id = 2
    )
    ORDER BY id ASC;
  `);

  return result.rows;
};

exports.setNotificationById = async (id, updates) => {
  return await withClientTransaction(async client => {
    const result = await client.query(
      updateQuery('notification', { id }, updates)
    );
    return result.rows[0];
  });
};

exports.expireNotificationById = async id => {
  return await withClientTransaction(async client => {
    const result = await query(sql`
      UPDATE notification
      SET expire_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `);
    return result.rows[0];
  });
};

exports.deleteNotificationById = async id => {
  return await withClientTransaction(async client => {
    const result = await query(sql`
      UPDATE notification
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `);
    return result.rows[0];
  });
};

exports.setNotificationAck = async (notification_id, user_id) => {
  return await withClientTransaction(async client => {
    const result = await query(sql`
      INSERT INTO notification_ack (notification_id, user_id)
      VALUES (${notification_id}, ${user_id})
      ON CONFLICT DO NOTHING
      RETURNING *;
    `);
    return result.rows[0];
  });
};
