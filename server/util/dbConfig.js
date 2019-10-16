const parse = require('url-parse');
const envConfig = require('dotenv').config().parsed || {};
const devConfig = require('../database.json').dev;

exports.getDbConfig = function() {
    // This is the environment variable Heroku exposes
    const dbUrl = process.env.DATABASE_URL || envConfig.DATABASE_URL;
    if (dbUrl) {
        const {
            username: user,
            password,
            hostname: host,
            port,
            pathname
        } = parse(dbUrl, true);
        return {
            user,
            password,
            host,
            port,
            // the database name is included in the pathname
            //  the pathname string starts with a  '/', so to
            //  get the database name, take the subtring
            database: pathname.substring(1),
            ssl: true,
            sslmode: 'require'
        };
    }

    return devConfig;
};
