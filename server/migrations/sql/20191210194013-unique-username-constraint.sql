ALTER TABLE users
    ADD CONSTRAINT usernames_must_be_unique UNIQUE (username);
-- Up above
---
-- Down below
ALTER TABLE users
    DROP CONSTRAINT usernames_must_be_unique;
