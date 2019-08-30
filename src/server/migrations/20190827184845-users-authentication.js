'use strict';

exports.up = function(db) {
    return db.runSql(`
        ALTER TABLE users
        ADD COLUMN id SERIAL PRIMARY KEY,
        ADD COLUMN email TEXT,
        ADD COLUMN username TEXT,
        ADD COLUMN hash TEXT,
        ADD COLUMN salt TEXT;
    `);
};

exports.down = function(db) {
    return db.runSql(`
        DELETE FROM users
        RETURNING *;
        ALTER TABLE users
        DROP COLUMN id,
        DROP COLUMN email,
        DROP COLUMN username,
        DROP COLUMN hash,
        DROP COLUMN salt;
    `);
};

exports._meta = {
    version: 1
};
