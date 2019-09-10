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

const getUserRolesInDatabase = async function(userId, roles) {
    const client = await pool.connect();
    const result = await client.query(
        sql`SELECT * FROM roles WHERE userid = ${userId};`
    );

    return { roles: result.rows };
};

const getUserRolesBackend = async function(req, res, next) {
    const client = await pool.connect();
    const user = req.body.user;
    const userId = await getUserInDatabase(user);

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

const addUserRolesToDatabase = async function(req, res, next) {
    const userId = await getUserInDatabase(req.body.user);
    const roles = req.body.roles;

    if (!userId || !roles) {
        const roleCreateError = new Error('User and roles must be defined');
        roleCreateError.status = 409;
        return apiError(res, roleCreateError);
    }

    const client = await pool.connect();
    const deduplicatedRoles = await deduplicateUserRoles(userId, roles);

    for (const role of deduplicatedRoles) {
        try {
            await client.query('BEGIN');
            const result = await client.query(
                sql`INSERT INTO roles(userid, role) VALUES(${userId}, ${role});`
            );
            await client.query('COMMIT');
            roleCreated = true;
        } catch (e) {
            console.log('e', e);
            const roleServerError = new Error('Role not created. Server error');
            roleServerError.status = 500;
            await client.query('ROLLBACK');
            client.release();

            return apiError(res, roleServerError);
        }
    }
    client.release();
    res.sendStatus(201);
};

const deduplicateUserRoles = async function(userId, roles) {
    const client = await pool.connect();
    const userRolesData = await getUserRolesInDatabase(userId);
    const userRoles = userRolesData.roles.map(userData => userData.role);
    const deduplicatedRoles = roles.filter(role => !userRoles.includes(role));

    client.release();
    return deduplicatedRoles;
};

const getUserRoles = asyncMiddleware(getUserRolesBackend);
const addUserRoles = asyncMiddleware(addUserRolesToDatabase);

module.exports = { getUserRoles, addUserRoles };
