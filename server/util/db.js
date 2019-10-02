const { Pool, Client } = require('pg');

const oldQuery = Client.prototype.query;

if (String(process.env.DEBUG).includes('sql') || process.env.SQL_DEBUG) {
    Client.prototype.query = function(...args) {
        // eslint-disable-next-line no-console
        console.log('QUERY');
        // eslint-disable-next-line no-console
        console.log(...args.filter(f => typeof f !== 'function'));
        return oldQuery.apply(this, args);
    };
}

const pool = new Pool();

exports.withClient = async method => {
    let client = pool.connect();
    try {
        return await method(await client);
    } finally {
        (await client).release();
    }
};

exports.query = (...args) =>
    exports.withClient(client => client.query(...args));

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

exports.withClientTransaction = method =>
    exports.withClient(client => exports.usingTransaction(client, method));
