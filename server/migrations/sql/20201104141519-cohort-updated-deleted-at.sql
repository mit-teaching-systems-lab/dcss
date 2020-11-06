ALTER TABLE cohort
    ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NULL,
    ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Up above
---
-- Down below

ALTER TABLE cohort
    DROP COLUMN updated_at,
    DROP COLUMN deleted_at;
