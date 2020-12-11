ALTER TABLE chat_message
  ADD COLUMN is_unquotable BOOLEAN DEFAULT FALSE;

-- Up above
---
-- Down below

ALTER TABLE chat_message
  DROP COLUMN is_unquotable;
