CREATE VIEW runs AS
SELECT
  r.id,
  r.user_id,
  r.scenario_id,
  r.created_at,
  r.updated_at,
  r.ended_at,
  u.email,
  u.username,
  s.title,
  s.description
FROM run r
INNER JOIN (
  SELECT u.id as user_id, u.email, u.username
  FROM users u
) u ON u.user_id = r.user_id
INNER JOIN (
  SELECT s.id as scenario_id, s.title, s.description
  FROM scenario s
) s ON s.scenario_id = r.scenario_id;
-- Up above
---
-- Down below
DROP VIEW runs;
