INSERT INTO interaction_type (name)
VALUES
  ('MultiPathResponse'),
  ('MultiButtonResponse')
;

-- Up above
---
-- Down below

DELETE FROM interaction_type
WHERE name IN ('MultiPathResponse', 'MultiButtonResponse');
