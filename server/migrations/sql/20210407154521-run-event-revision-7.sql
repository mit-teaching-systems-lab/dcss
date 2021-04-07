CREATE INDEX IF NOT EXISTS idx_run_event_user_id
  ON run_event(user_id);

-- Up above
---
-- Down below

DROP INDEX IF EXISTS idx_run_event_user_id;
