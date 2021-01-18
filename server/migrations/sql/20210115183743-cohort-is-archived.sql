ALTER TABLE cohort
    ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;

-- Up above
---
-- Down below

ALTER TABLE cohort
    DROP COLUMN is_archived;

