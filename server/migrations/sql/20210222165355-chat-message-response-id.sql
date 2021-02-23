ALTER TABLE chat_message
  ADD COLUMN response_id TEXT DEFAULT '';

ALTER TABLE chat_message_archive
  ADD COLUMN response_id TEXT DEFAULT '';

-- Up above
---
-- Down below

ALTER TABLE chat_message
  DROP COLUMN response_id;

ALTER TABLE chat_message_archive
  DROP COLUMN response_id;
