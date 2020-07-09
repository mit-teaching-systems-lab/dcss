CREATE TABLE scenario_user_role (
  scenario_id INT REFERENCES scenario(id),
  user_id INT REFERENCES users(id),
  role VARCHAR NOT NULL CHECK (role IN ('owner', 'author', 'reviewer')),
  PRIMARY KEY (scenario_id, user_id, role),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMPTZ
);

-- owner        : can edit and delete the scenario
-- author       : can edit the scenario
-- reviewer     : can view the scenario in the editor,
--                but may not edit; autosave features are disabled

WITH n AS (SELECT id AS scenario_id, author_id AS user_id, created_at FROM scenario)
INSERT INTO scenario_user_role (scenario_id, user_id, role, created_at)
SELECT scenario_id, user_id, 'owner', created_at FROM n
ON CONFLICT DO NOTHING;

WITH n AS (SELECT id AS scenario_id, author_id AS user_id, created_at FROM scenario)
INSERT INTO scenario_user_role (scenario_id, user_id, role, created_at)
SELECT scenario_id, user_id, 'author', created_at FROM n
ON CONFLICT DO NOTHING;

-- Up above
---
-- Down below

DROP TABLE scenario_user_role;
