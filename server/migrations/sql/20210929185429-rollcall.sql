CREATE TABLE rollcall (
  id SERIAL PRIMARY KEY,
  room_key TEXT,
  user_id INT REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_rollcall_room_key
  ON rollcall(room_key);

CREATE INDEX IF NOT EXISTS idx_rollcall_user_id
  ON rollcall(user_id);

-- Up above
---
-- Down below

DROP INDEX IF EXISTS idx_rollcall_room_key;
DROP INDEX IF EXISTS idx_rollcall_user_id;
DROP TABLE IF EXISTS rollcall;
