const { sql } = require('../../util/sqlHelpers');
const { query, withClient, withClientTransaction } = require('../../util/db');

exports.getAllUsers = async () => {
  const result = await query(sql`
    SELECT *
    FROM user_role_detail
  `);
  return result.rows;
};

exports.getAllUsersCount = async () => {
  const results = await query(sql`
    SELECT
      COUNT(id)
    FROM user_role_detail
  `);

  let count = 0;

  if (results.rows.length) {
    ({ count } = results.rows[0]);
  }

  return count;
};

exports.getAvailableUsers = async () => {
  const result = await query(sql`
    SELECT *
    FROM user_role_detail
    WHERE lastseen_at >= NOW() - interval '6 hours'
  `);
  return result.rows;
};

exports.getAvailableUsersCount = async () => {
  const results = await query(sql`
    SELECT
      COUNT(id)
    FROM user_role_detail
    WHERE lastseen_at >= NOW() - interval '6 hours'
  `);

  let count = 0;

  if (results.rows.length) {
    ({ count } = results.rows[0]);
  }
  return count;
};

exports.getUserRoles = async user_id => {
  const result = await query(sql`
    SELECT *
    FROM user_role
    WHERE user_id = ${user_id};
  `);
  return { roles: result.rows.map(row => row.role) };
};

exports.addUserRoles = async (user_id, roles) => {
  return withClientTransaction(async client => {
    // const result = await client.query(sql`
    //   INSERT INTO user_role (user_id, role)
    //   SELECT ${user_id} as user_id, t.role FROM jsonb_array_elements_text(${roles}) AS t (role)
    //   ON CONFLICT DO NOTHING;
    // `);
    const [role] = roles;
    const result = await client.query(sql`
      INSERT INTO user_role (user_id, role)
      VALUES (${user_id}, ${role})
      ON CONFLICT DO NOTHING;
    `);

    // cascade newly granted researcher roles down to
    // cohorts that the user owns.
    if (role === 'researcher') {
      await client.query(sql`
        WITH cs AS (
          SELECT cohort_id
          FROM cohort_user_role cur
          WHERE cur.role = 'owner'
          AND cur.user_id = ${user_id}
        )
        INSERT INTO cohort_user_role (cohort_id, user_id, role)
        SELECT cohort_id, ${user_id} AS user_id, 'researcher' AS role
        FROM cs
        ON CONFLICT DO NOTHING;
      `);
    }
    return { addedCount: result.rowCount };
  });
};

exports.deleteUserRoles = async (user_id, roles) => {
  return withClientTransaction(async client => {
    // const result = await client.query(sql`
    //   DELETE FROM user_role
    //   WHERE user_id = ${user_id}
    //   AND role IN (SELECT jsonb_array_elements_text(${roles}));
    // `);
    const [role] = roles;
    const result = await client.query(sql`
      DELETE FROM user_role
      WHERE user_id = ${user_id}
      AND role = ${role};
    `);
    return { deletedCount: result.rowCount };
  });
};

exports.setUserRoles = async (userId, roles) => {
  return withClientTransaction(async client => {
    const add = await client.query(sql`
      INSERT INTO user_role (user_id, role)
      SELECT ${userId} as user_id, t.role FROM jsonb_array_elements_text(${roles}) AS t (role)
      ON CONFLICT DO NOTHING;
    `);
    const del = await client.query(sql`
      DELETE FROM user_role
      WHERE user_id = ${userId}
      AND role NOT IN (
        SELECT jsonb_array_elements_text(${roles})
      );
    `);
    return {
      addedCount: add.rowCount || 0,
      deletedCount: del.rowCount || 0,
      rolesCount: roles.length || 0
    };
  });
};

exports.addRolePermissions = async (role, permission) => {
  return withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO role_permission (role, permission)
      VALUES (${role}, ${permission})
      ON CONFLICT DO NOTHING;
    `);
    return { addedCount: result.rowCount || 0 };
  });
};

exports.getUserPermissions = async userId => {
  const { roles } = await this.getUserRoles(userId);
  const permissions = new Set();
  const result = await query(sql`
    SELECT *
    FROM role_permission
    WHERE role IN (
      SELECT jsonb_array_elements_text(${roles})
    );`);

  result.rows.map(({ permission }) => {
    permissions.add(permission);
  });
  return { permissions: [...permissions] };
};

exports.getUsersByPermission = async permission => {
  const { rows } = await query(sql`
    SELECT role
    FROM role_permission
    WHERE permission = ${permission};
  `);
  const requestedRoles = rows.map(({ role }) => role);
  const result = await query(sql`
    SELECT id, username
    FROM users
    WHERE id IN (
      SELECT user_id
      FROM user_role
      WHERE role IN (
        SELECT jsonb_array_elements_text(${requestedRoles})
      )
    );
  `);
  return result.rows;
};
