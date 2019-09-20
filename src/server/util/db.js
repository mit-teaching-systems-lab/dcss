const { Pool } = require('pg');
const pool = new Pool();

exports.withClient = async method => {
    let client = pool.connect();
    try {
        return await method(await client);
    } finally {
        (await client).release();
    }
};

exports.usingTransaction = async (client, method) => {
    try {
        await client.query('BEGIN');
        const result = await method(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
};

exports.withClientTransacation = method =>
    exports.withClient(client => exports.usingTransaction(client, method));
