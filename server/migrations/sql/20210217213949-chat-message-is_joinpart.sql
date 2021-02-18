ALTER TABLE chat_message
  ADD COLUMN is_joinpart BOOLEAN DEFAULT FALSE;

UPDATE chat_message
SET is_joinpart = TRUE
WHERE is_quotable = FALSE;

-- Up above
---
-- Down below

ALTER TABLE chat_message
  DROP COLUMN is_joinpart;
