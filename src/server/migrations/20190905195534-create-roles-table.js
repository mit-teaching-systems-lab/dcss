'use strict';

exports.up = function(db) {
    return db.runSql(
        `CREATE TABLE "roles" (
        id SERIAL PRIMARY KEY,
        role varchar NOT NULL CHECK (role IN ('super_admin', 'admin', 'researcher', 'facilitator', 'participant')),
        userid int NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id)
        )`
    );
};

exports.down = function(db) {
    return db.dropTable('roles');
};

exports._meta = {
    version: 1
};
