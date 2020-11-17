ALTER TABLE persona
    ADD COLUMN author_id INT NOT NULL REFERENCES users(id);

-- Up above
---
-- Down below

ALTER TABLE persona
  DROP COLUMN author_id;

