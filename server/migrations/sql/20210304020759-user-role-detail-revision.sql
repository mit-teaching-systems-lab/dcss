ALTER TABLE users
  ADD COLUMN is_agent BOOL DEFAULT FALSE;

CREATE OR REPLACE VIEW user_role_detail AS
  SELECT
    users.id,
    users.username,
    users.personalname,
    users.email,
    users.single_use_password,
    users.lastseen_at,
    COALESCE(
      (
        SELECT ARRAY_AGG(role) AS roles
        FROM user_role
        WHERE user_role.user_id = users.id
      ),
      '{}'::varchar[]
    ) AS roles,
    (SELECT COUNT(*) > 0 AS is_super
      FROM user_role
      WHERE user_role.user_id = users.id
      AND user_role.role = 'super_admin'),
    users.email = '' OR users.email IS NULL OR users.hash IS NULL AS is_anonymous,
    users.is_agent
  FROM users;

-- Up above
---
-- Down below

CREATE OR REPLACE VIEW user_role_detail AS
  SELECT
    users.id,
    users.username,
    users.personalname,
    users.email,
    users.single_use_password,
    users.lastseen_at,
    COALESCE(
      (
        SELECT ARRAY_AGG(role) AS roles
        FROM user_role
        WHERE user_role.user_id = users.id
      ),
      '{}'::varchar[]
    ) AS roles,
    (SELECT COUNT(*) > 0 AS is_super
      FROM user_role
      WHERE user_role.user_id = users.id
      AND user_role.role = 'super_admin'),
    users.email = '' OR users.email IS NULL OR users.hash IS NULL AS is_anonymous,
    FALSE as is_agent
  FROM users;

ALTER TABLE users
  DROP COLUMN is_agent;
