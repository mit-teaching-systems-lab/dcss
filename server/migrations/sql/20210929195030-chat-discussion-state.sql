CREATE TABLE chat_discussion (
  id SERIAL PRIMARY KEY,
  room_key TEXT UNIQUE,
  state INT
);

CREATE INDEX IF NOT EXISTS idx_chat_discussion_room_key
  ON chat_discussion(room_key);

-- Up above
---
-- Down below

DROP INDEX IF EXISTS idx_chat_discussion_room_key;
DROP TABLE IF EXISTS chat_discussion;
