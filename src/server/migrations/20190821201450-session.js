'use strict';

exports.up = function(db) {
    // This is from https://github.com/voxpelli/node-connect-pg-simple/blob/HEAD/table.sql
    // It is a requirement to use the Postgres store
    return db.runSql(
        `CREATE TABLE "session" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);
    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    `
    );
};

exports.down = function(db) {
    return db.dropTable('session');
};

exports._meta = {
    version: 1
};
