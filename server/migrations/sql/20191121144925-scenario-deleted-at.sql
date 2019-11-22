ALTER TABLE scenario
    ADD COLUMN deleted_at TIMESTAMPTZ;

-- Up above
---
-- Down below

ALTER TABLE scenario
    DROP COLUMN deleted_at;
