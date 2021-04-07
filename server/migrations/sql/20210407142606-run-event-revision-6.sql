ALTER TABLE run_event
  ALTER COLUMN run_id DROP NOT NULL,
  ADD COLUMN user_id INT REFERENCES users(id);

-- Up above
---
-- Down below

ALTER TABLE run_event
  ALTER COLUMN run_id SET NOT NULL,
  DROP COLUMN user_id;
