CREATE VIEW run_view AS
  SELECT
    id,
    id as run_id,
    scenario_id,
    cohort_run.cohort_id,
    user_id,
    created_at,
    updated_at,
    ended_at,
    consent_id,
    consent_acknowledged_by_user,
    consent_granted_by_user,
    referrer_params
  FROM run
  LEFT JOIN cohort_run ON run.id = cohort_run.run_id;

-- Up above
---
-- Down below
DROP VIEW run_view;
