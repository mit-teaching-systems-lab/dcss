CREATE INDEX IF NOT EXISTS idx_cohort_run_cohort_id
  ON cohort_run(cohort_id);

CREATE INDEX IF NOT EXISTS idx_cohort_run_run_id
  ON cohort_run(run_id);

CREATE INDEX IF NOT EXISTS idx_run_event_name
  ON run_event(name);

CREATE INDEX IF NOT EXISTS idx_run_event_run_id
  ON run_event(run_id);

-- Up above
---
-- Down below

DROP INDEX IF EXISTS idx_cohort_run_cohort_id;
DROP INDEX IF EXISTS idx_cohort_run_run_id;
DROP INDEX IF EXISTS idx_run_event_name;
DROP INDEX IF EXISTS idx_run_event_run_id;
