'use strict';

exports.up = function(db) {
    return db.runSql(
        `CREATE TABLE "roles" (
        id SERIAL PRIMARY KEY,
        role varchar NOT NULL,
        userid int NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id)
        )`
    );
};

exports.down = function(db) {
    return db.dropTable('users');
};

exports._meta = {
    version: 1
};
