ALTER TABLE scenario
  DROP CONSTRAINT scenario_description_check;
-- Up above
---
-- Down below
ALTER TABLE scenario
  ADD CONSTRAINT scenario_description_check CHECK(description <> '');
