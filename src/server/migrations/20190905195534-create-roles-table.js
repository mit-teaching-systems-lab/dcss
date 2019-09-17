'use strict';

exports.up = function(db) {
    return db.runSql(
        `CREATE TABLE "roles" (
        id SERIAL PRIMARY KEY,
        role VARCHAR NOT NULL CHECK (role IN ('super_admin', 'admin', 'researcher', 'facilitator', 'participant')),
        user_id INT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
        )`
    );
};

exports.down = function(db) {
    return db.dropTable('roles');
};

exports._meta = {
    version: 1
};
