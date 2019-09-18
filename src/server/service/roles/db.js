const { Pool } = require('pg');

const { sql } = require('../../util/sqlHelpers');

const pool = new Pool();

exports.getUserRoles = async function getUserRoles(userId) {
    const client = await pool.connect();
    const result = await client.query(
        sql`SELECT * FROM user_role WHERE user_id = ${userId};`
    );
    return { roles: result.rows.map(row => row.role) };
};

exports.addUserRoles = async function addUserRoles(userId, roles) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(sql`

INSERT INTO user_role (user_id, role)
    SELECT ${userId} as user_id, t.role FROM jsonb_array_elements_text(${roles}) AS t (role)
    ON CONFLICT DO NOTHING;
    
                    `);
        await client.query('COMMIT');
    } catch (e) {
        const roleServerError = new Error('Role not created. Server error');
        roleServerError.stack = e.stack;
        roleServerError.status = 500;
        await client.query('ROLLBACK');
        client.release();

        return roleServerError;
    }

    client.release();
    return { status: 201 };
};

exports.deleteUserRoles = async function(userId, roles) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await client.query(
            sql`DELETE FROM user_role WHERE user_id = ${userId} AND role IN (SELECT jsonb_array_elements_text(${roles}));`
        );
        await client.query('COMMIT');
    } catch (e) {
        const roleServerError = new Error('Role not removed. Server error');
        roleServerError.stack = e.stack;
        roleServerError.status = 500;
        await client.query('ROLLBACK');

        return roleServerError;
    }

    client.release();
    return { status: 200 };
};
