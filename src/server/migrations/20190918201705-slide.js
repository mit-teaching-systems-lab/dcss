'use strict';

exports.up = function(db) {
  return db.runSql(
    `
CREATE TABLE slide (
    id SERIAL PRIMARY KEY,
    scenario_id INT NOT NULL REFERENCES scenario(id),
    order INT NOT NULL,
    components JSONB
);
    `
    );
};

exports.down = function(db) {
    return db.dropTable('slide');
};

exports._meta = {
  "version": 1
};
