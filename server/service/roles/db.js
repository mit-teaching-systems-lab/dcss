const { sql } = require('../../util/sqlHelpers');
const { withClient, withClientTransaction } = require('../../util/db');

exports.getUserById = async function getUserById(id) {
    return withClient(async client => {
        const result = await client.query(
            sql`SELECT * FROM users WHERE id = ${id};`
        );
        return result.rows[0];
    });
};

exports.getAllUsersRoles = async function getAllUsersRoles() {
    return withClient(async client => {
        const result = await client.query(sql`SELECT * FROM user_role_detail`);
        return result.rows;
    });
};

exports.getUserRoles = async function getUserRoles(userId) {
    return withClient(async client => {
        const result = await client.query(
            sql`SELECT * FROM user_role WHERE user_id = ${userId};`
        );
        return { roles: result.rows.map(row => row.role) };
    });
};

exports.addUserRoles = async function addUserRoles(userId, roles) {
    return withClientTransaction(async client => {
        const result = await client.query(sql`
INSERT INTO user_role (user_id, role)
    SELECT ${userId} as user_id, t.role FROM jsonb_array_elements_text(${roles}) AS t (role)
    ON CONFLICT DO NOTHING;`);
        return { addedCount: result.rowCount };
    });
};

exports.setUserRoles = async function setUserRoles(userId, roles) {
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

exports.deleteUserRoles = async function(userId, roles) {
    return withClientTransaction(async client => {
        const result = await client.query(
            sql`DELETE FROM user_role WHERE user_id = ${userId} AND role IN (SELECT jsonb_array_elements_text(${roles}));`
        );
        return { deletedCount: result.rowCount };
    });
};
