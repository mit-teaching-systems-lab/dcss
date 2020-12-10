ALTER TABLE notification
  RENAME COLUMN expires_at TO expire_at;

-- Up above
---
-- Down below

ALTER TABLE notification
  RENAME COLUMN expire_at TO expires_at;
