ALTER TABLE chat_message
  RENAME COLUMN is_unquotable TO is_quotable;

ALTER TABLE chat_message
  ALTER COLUMN is_quotable SET DEFAULT TRUE;

UPDATE chat_message
SET is_quotable = CASE is_quotable
  WHEN FALSE THEN TRUE
  ELSE FALSE
END


-- Up above
---
-- Down below

ALTER TABLE chat_message
  RENAME COLUMN is_quotable TO is_unquotable;

ALTER TABLE chat_message
  ALTER COLUMN is_unquotable SET DEFAULT TRUE;

UPDATE chat_message
SET is_unquotable = CASE is_unquotable
  WHEN TRUE THEN FALSE
  ELSE TRUE
END
