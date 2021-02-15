ALTER TABLE chat_user
  ADD COLUMN ended_at TIMESTAMPTZ DEFAULT NULL;

-- Up above
---
-- Down below

ALTER TABLE chat_user
  DROP COLUMN ended_at;

