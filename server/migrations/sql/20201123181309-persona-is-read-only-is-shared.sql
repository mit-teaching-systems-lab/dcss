ALTER TABLE persona
  ADD COLUMN is_read_only BOOLEAN DEFAULT FALSE,
  ADD COLUMN is_shared BOOLEAN DEFAULT FALSE;

-- Up above
---
-- Down below

ALTER TABLE persona
  DROP COLUMN is_read_only
  DROP COLUMN is_shared;

