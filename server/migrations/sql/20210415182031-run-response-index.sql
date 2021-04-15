CREATE INDEX IF NOT EXISTS idx_run_response_run_id
  ON run_response(run_id);

CREATE INDEX IF NOT EXISTS idx_run_response_user_id
  ON run_response(user_id);

-- Up above
---
-- Down below

DROP INDEX IF EXISTS idx_run_response_run_id;
DROP INDEX IF EXISTS idx_run_response_user_id;
