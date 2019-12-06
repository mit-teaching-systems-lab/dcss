ALTER TABLE cohort_user_role
    ADD COLUMN ended_at TIMESTAMPTZ;

-- Up above
---
-- Down below

ALTER TABLE cohort_user_role
    DROP COLUMN ended_at;

