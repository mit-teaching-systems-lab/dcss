const { sql } = require('../../util/sqlHelpers');
const { withClient, withClientTransaction } = require('../../util/db');

exports.getAllUsersRoles = async function() {
  return withClient(async client => {
    const result = await client.query(sql`
      SELECT * FROM user_role_detail
    `);
    return result.rows;
  });
};

exports.getUserRoles = async function(user_id) {
  console.log("!!!!!!!!!!!!!!!!!!!!!!getUserRoles!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  return withClient(async client => {
    const result = await client.query(sql`
      SELECT * FROM user_role WHERE user_id = ${user_id};
    `);
    return { roles: result.rows.map(row => row.role) };
  });
};

exports.addUserRoles = async function(user_id, roles) {
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
    return { addedCount: result.rowCount };
  });
};

exports.deleteUserRoles = async function(user_id, roles) {
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

exports.setUserRoles = async function(userId, roles) {
  return withClientTransaction(async client => {
    const add = await client.query(sql`
INSERT INTO user_role (user_id, role)
    SELECT ${userId} as user_id, t.role FROM jsonb_array_elements_text(${roles}) AS t (role)
    ON CONFLICT DO NOTHING;
            `);
    const del = await client.query(sql`
DELETE FROM user_role WHERE user_id = ${userId} AND role NOT IN (SELECT jsonb_array_elements_text(${roles}));
            `);
    return {
      addedCount: add.rowCount || 0,
      deletedCount: del.rowCount || 0,
      rolesCount: roles.length || 0
    };
  });
};

exports.addRolePermissions = async function(role, permission) {
  return withClientTransaction(async client => {
    const result = await client.query(sql`
INSERT INTO role_permission (role, permission)
    VALUES (${role}, ${permission})
    ON CONFLICT DO NOTHING;
        `);
    return { addedCount: result.rowCount || 0 };
  });
};

exports.getUserPermissions = async function(userId) {
  const { roles } = await this.getUserRoles(userId);

  return withClient(async client => {
    const permissions = new Set();
    const result = await client.query(
      sql`SELECT * FROM role_permission WHERE role IN (SELECT jsonb_array_elements_text(${roles}));`
    );

    result.rows.map(({ permission }) => {
      permissions.add(permission);
    });
    return { permissions: [...permissions] };
  });
};

exports.getUsersByPermission = async function(permission) {
  const requestedRoles = await withClient(async client => {
    const roles = [];
    const result = await client.query(sql`
SELECT role FROM role_permission WHERE permission = ${permission};`);

    result.rows.map(({ role }) => {
      roles.push(role);
    });

    return roles;
  });

  // Get all the users with a certain role
  return await withClient(async client => {
    const result = await client.query(sql`
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
  });
};
