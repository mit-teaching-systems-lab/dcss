const { sql } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');

exports.getRuns = async function getRuns(keyword) {
    const likable = `%${keyword}%`;
    const results = await query(
        sql`
SELECT * FROM runs
        WHERE username ILIKE ${likable}
           OR email ILIKE ${likable}
           OR title ILIKE ${likable}
           OR description ILIKE ${likable}
     ORDER BY ended_at DESC
        `
    );
    return results.rows || [];
};

exports.getUsers = async function getUsers(keyword) {
    const likable = `%${keyword}%`;
    const results = await query(
        sql`
SELECT * FROM users
        WHERE username ILIKE ${likable}
           OR email ILIKE ${likable}
        `
    );
    return results.rows || [];
};
