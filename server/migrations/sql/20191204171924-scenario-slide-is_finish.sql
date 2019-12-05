ALTER TABLE slide
    ADD COLUMN is_finish BOOLEAN DEFAULT FALSE;

-- Up above
---
-- Down below

ALTER TABLE slide
    DROP COLUMN is_finish;
