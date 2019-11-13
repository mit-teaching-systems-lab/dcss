DROP INDEX run_id_response_id;
ALTER TABLE run_response DROP COLUMN updated_at;
ALTER TABLE run_response ADD COLUMN user_id INTEGER REFERENCES users(id) NOT NULL;
-- Up above
---
-- Down below
CREATE UNIQUE INDEX run_id_response_id on run_response (run_id, response_id);
ALTER TABLE run_response DROP COLUMN user_id;
