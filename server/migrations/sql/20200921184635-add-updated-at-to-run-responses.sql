ALTER TABLE run_response
  ADD COLUMN updated_at TIMESTAMPTZ;
-- Up above
---
-- Down below

ALTER TABLE run_response
  DROP COLUMN updated_at;
