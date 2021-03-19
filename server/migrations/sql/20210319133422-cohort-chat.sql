ALTER TABLE cohort
  ADD COLUMN chat_id INT REFERENCES chat(id);

-- Up above
---
-- Down below

ALTER TABLE cohort
  DROP COLUMN chat_id;
