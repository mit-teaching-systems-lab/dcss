ALTER TABLE scenario
  ADD COLUMN is_example BOOLEAN DEFAULT FALSE;

---

ALTER TABLE scenario
  DROP COLUMN is_example;

