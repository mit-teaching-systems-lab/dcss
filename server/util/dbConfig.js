const envConfig = require('dotenv').config().parsed || {};
const databases = require('../database.json');

const config = process.env.DB_CONFIG
  ? process.env.DB_CONFIG
  : 'dev';

const devConfig = databases[config];

exports.getDbConfig = function() {
  // This is the environment variable Heroku exposes
  const connectionString = process.env.DATABASE_URL || envConfig.DATABASE_URL;
  if (connectionString) {
    return {
      connectionString,
      ssl: true,
      sslmode: 'require'
    };
  }

  return devConfig;
};
