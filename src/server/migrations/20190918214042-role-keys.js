'use strict';

exports.up = function(db) {
    return db.runSql(`
ALTER TABLE roles 
  RENAME TO user_role;
ALTER TABLE user_role
  DROP COLUMN id,
  ADD PRIMARY KEY(user_id, role);
`);
};

exports.down = function(db) {
    return db.runSql(`
  ALTER TABLE user_role 
    RENAME TO roles;
  ALTER TABLE roles
    DROP CONSTRAINT user_role_pkey,
    ADD COLUMN id SERIAL PRIMARY KEY;
  `);
};

exports._meta = {
    version: 1
};
