const { Pool } = require('pg');

const { sql } = require('../../util/sqlHelpers');

const pool = new Pool();

exports.getUserRoles = async function getUserRoles(userId) {
    const client = await pool.connect();
    try {
        const result = await client.query(
            sql`SELECT * FROM user_role WHERE user_id = ${userId};`
        );
        return { roles: result.rows.map(row => row.role) };
    } finally {
        client.release();
    }
};

exports.addUserRoles = async function addUserRoles(userId, roles) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(sql`
INSERT INTO user_role (user_id, role)
    SELECT ${userId} as user_id, t.role FROM jsonb_array_elements_text(${roles}) AS t (role)
    ON CONFLICT DO NOTHING;`);
        await client.query('COMMIT');
        return { addedCount: result.rowCount };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

exports.setUserRoles = async function setUserRoles(userId, roles) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const add = await client.query(sql`
INSERT INTO user_role (user_id, role)
    SELECT ${userId} as user_id, t.role FROM jsonb_array_elements_text(${roles}) AS t (role)
    ON CONFLICT DO NOTHING;
            `);
        const del = await client.query(sql`
DELETE FROM user_role WHERE user_id = ${userId} AND role NOT IN (SELECT jsonb_array_elements_text(${roles}));
            `);
        await client.query('COMMIT');
        return {
            addedCount: add.rowCount || 0,
            deletedCount: del.rowCount || 0,
            rolesCount: roles.length || 0
        };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

exports.deleteUserRoles = async function(userId, roles) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            sql`DELETE FROM user_role WHERE user_id = ${userId} AND role IN (SELECT jsonb_array_elements_text(${roles}));`
        );
        await client.query('COMMIT');
        return { deletedCount: result.rowCount };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};
