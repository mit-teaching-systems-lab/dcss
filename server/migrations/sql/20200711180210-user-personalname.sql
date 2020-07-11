ALTER TABLE users
    ADD COLUMN personalname TEXT DEFAULT NULL;

-- Up above
---
-- Down below

ALTER TABLE users
    DROP COLUMN personalname;
