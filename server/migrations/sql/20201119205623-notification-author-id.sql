-- author_id may be null because the site creates its own notifications.
ALTER TABLE notification
    ADD COLUMN author_id INTEGER DEFAULT NULL;

-- Up above
---
-- Down below

ALTER TABLE notification
    DROP COLUMN author_id;
