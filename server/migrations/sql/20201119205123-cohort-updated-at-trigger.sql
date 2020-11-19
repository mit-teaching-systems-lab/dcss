CREATE TRIGGER updated_at
  BEFORE UPDATE ON cohort
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

-- Up above
---
-- Down below

DROP TRIGGER updated_at ON cohort;
