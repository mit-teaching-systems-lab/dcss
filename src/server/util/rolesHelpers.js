const { Pool } = require('pg');

const { apiError, asyncMiddleware } = require('./api');
const { sql } = require('./sqlHelpers');

// Do we want our own pool or should this be shared with the user authentication pool?
const pool = new Pool();

const getUserInDatabase = async function(user) {
    const client = await pool.connect();
    const result = await client.query(
        sql`SELECT * FROM users WHERE email = ${user} OR username = ${user};`
    );
    const userId = result.rows[0] ? result.rows[0].id : null; // Should we account for getting more than one user back?

    client.release();
    return userId;
};

const getUserRolesInDatabase = async function(userId) {
    const client = await pool.connect();
    const result = await client.query(
        sql`SELECT * FROM roles WHERE userid = ${userId};`
    );

    return { roles: result.rows };
};

const addUserRolesToDatabase = async function(userId, roles) {
    const client = await pool.connect();
    const deduplicatedRoles = await deduplicateUserRoles(userId, roles);

    for (const role of deduplicatedRoles) {
        try {
            await client.query('BEGIN');
            await client.query(
                sql`INSERT INTO roles(userid, role) VALUES(${userId}, ${role});`
            );
            await client.query('COMMIT');
        } catch (e) {
            const roleServerError = new Error('Role not created. Server error');
            roleServerError.status = 500;
            await client.query('ROLLBACK');
            client.release();

            return roleServerError;
        }
    }

    client.release();
    return { status: 201 };
};

const deleteUserRoleInDatabase = async function(userId, role) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await client.query(
            sql`DELETE FROM roles WHERE userid = ${userId} AND role = ${role};`
        );
        await client.query('COMMIT');
    } catch (e) {
        const roleServerError = new Error('Role not created. Server error');
        roleServerError.status = 500;
        await client.query('ROLLBACK');

        return roleServerError;
    }

    client.release();
    return { status: 200 };
};

const deduplicateUserRoles = async function(userId, roles) {
    const userRolesData = await getUserRolesInDatabase(userId);
    const userRoles = userRolesData.roles.map(userData => userData.role);
    const deduplicatedRoles = roles.filter(role => !userRoles.includes(role));

    return deduplicatedRoles;
};

const getUserRolesBackend = async function(req, res) {
    const user = req.body.user;
    const userId = await getUserInDatabase(user);
    let userRoleData = null;

    if (userId) {
        userRoleData = await getUserRolesInDatabase(userId, req.body.roles);
        userRoleData.user = user;
    } else {
        const noUserFoundError = new Error(
            'No user exists with that email address or username.'
        );
        noUserFoundError.status = 409;

        return apiError(res, noUserFoundError);
    }

    res.json(userRoleData);
};

const addUserRolesBackend = async function(req, res) {
    const userId = await getUserInDatabase(req.body.user);
    const roles = req.body.roles;

    if (!userId || !roles.length) {
        const roleCreateError = new Error('User and roles must be defined');
        roleCreateError.status = 409;
        return apiError(res, roleCreateError);
    }

    const result = await addUserRolesToDatabase(userId, roles);

    if (result.status !== 201) {
        console.log('result', result);
        return apiError(result);
    }

    res.sendStatus(result.status);
};

const deleteUserRolesBackend = async function(req, res) {
    const userId = await getUserInDatabase(req.body.user);
    const roles = req.body.roles;

    if (!userId || !roles.length) {
        const roleCreateError = new Error('User and roles must be defined');
        roleCreateError.status = 409;
        return apiError(res, roleCreateError);
    }

    for (const role of roles) {
        const result = await deleteUserRoleInDatabase(userId, role);

        if (result.status !== 200) {
            return apiError(res, result);
        }
    }
    res.sendStatus(200);
};

const getUserRoles = asyncMiddleware(getUserRolesBackend);
const addUserRoles = asyncMiddleware(addUserRolesBackend);
const deleteUserRoles = asyncMiddleware(deleteUserRolesBackend);

module.exports = { getUserRoles, addUserRoles, deleteUserRoles };
