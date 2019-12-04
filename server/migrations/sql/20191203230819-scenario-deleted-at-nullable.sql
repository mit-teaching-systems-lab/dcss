ALTER TABLE scenario
    ALTER COLUMN deleted_at DROP NOT NULL;
-- Up above
---
-- Down below
ALTER TABLE scenario
    ALTER COLUMN deleted_at SET NOT NULL;
