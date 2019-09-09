const { Pool } = require('pg');

// Do we want our own pool or should this be shared with the user authentication pool?
const pool = new Pool();

const getUserInDatabase = async function(username, email) {
    const client = await pool.connect();
    const result = await client.query(
        sql`SELECT * FROM users WHERE email = ${email} OR username = ${username};`
    );
    client.release();
    return result.rows;
};