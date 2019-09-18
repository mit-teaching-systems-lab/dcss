'use strict';

exports.up = function(db) {
      return db.runSql(
        `
CREATE OR REPLACE FUNCTION updated_at() RETURNS TRIGGER AS $$
  BEGIN
    IF (NEW != OLD) THEN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END IF;
    RETURN OLD;
  END;
$$ LANGUAGE plpgsql;

CREATE TABLE scenario (
    id SERIAL PRIMARY KEY,
    author_id INT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL CHECK(title <> ''),
    description TEXT NOT NULL CHECK(description <> ''),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TRIGGER updated_at BEFORE UPDATE ON scenario
    FOR EACH ROW EXECUTE PROCEDURE updated_at();
    `
    );
};

exports.down = function(db) {

  return db.runSql(
    `
    DROP TABLE scenario;
    DROP FUNCTION updated_at();
    `
    );
};

exports._meta = {
  "version": 1
};
