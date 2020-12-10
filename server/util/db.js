const Emitter = require('events');
const { getDbConfig } = require('./dbConfig');
const { Pool, Client } = require('pg');

const oldQuery = Client.prototype.query;

if (String(process.env.DEBUG).includes('sql') || process.env.SQL_DEBUG) {
  Client.prototype.query = function(...args) {
    // eslint-disable-next-line no-console
    console.log('QUERY', new Date().toString());
    // eslint-disable-next-line no-console
    console.log(...args.filter(f => typeof f !== 'function'));
    return oldQuery.apply(this, args);
  };
}

const pool = new Pool(getDbConfig());

// Create a single client to handle receiving and
// broadcasting LISTEN/NOTIFY messages.
const client = new Client(getDbConfig());
const notifier = new Emitter();

client.connect();
client.query('LISTEN new_notification');
client.query('LISTEN new_chat_message');
client.query('LISTEN join_or_part_chat');

client.on('notification', ({ channel, payload }) => {
  notifier.emit(channel, JSON.parse(payload));
});

exports.notifier = notifier;

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
