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
const notifier = new Emitter();

(async () => {
  if (process.env.DB_CONFIG && process.env.DB_CONFIG === 'test') {
    return;
  }

  console.log('ATTACHING LISTENERS');
  const client = await pool.connect();
  const result = await client.query(`
    SELECT pid
    FROM pg_stat_activity
    WHERE query LIKE 'LISTEN%'
  `);

  if (result.rowCount) {
    console.log('TERMINATING STALE LISTENERS');
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE query LIKE 'LISTEN%'
    `);
  }

  await client.query(`
    LISTEN new_notification;
    LISTEN new_chat_message;
    LISTEN join_or_part_chat;
  `);

  client.on('notification', ({ channel, payload }) => {
    notifier.emit(channel, JSON.parse(payload));
  });

  // local dev with nodemon
  process.once('SIGUSR2', async () => {
    await client.release();
    process.kill(process.pid, 'SIGUSR2');
  });

  // staging/production
  process.on('beforeExit', async () => {
    await client.release();
  });

  process.on('uncaughtException', ({ message }) => {
    console.log(`Uncaught Exception: ${message}`);
    client.release();
    process.exit(1);
  });

  process.on('unhandledRejection', ({ message }) => {
    console.log(`Unhandled rejection: ${message}`);
    client.release();
    process.exit(1);
  });
})();

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
