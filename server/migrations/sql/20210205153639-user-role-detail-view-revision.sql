ALTER TABLE users
  ADD COLUMN lastseen_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

DROP VIEW user_role_detail;

CREATE VIEW user_role_detail AS
  SELECT
    users.id,
    users.username,
    users.personalname,
    users.email,
    users.single_use_password,
    users.lastseen_at,
    (SELECT ARRAY_AGG(role) AS roles
      FROM user_role
      WHERE user_role.user_id = users.id),
    (SELECT COUNT(*) > 0 AS is_super
      FROM user_role
      WHERE user_role.user_id = users.id
      AND user_role.role = 'super_admin'),
    users.email = '' OR users.email IS NULL OR users.hash IS NULL AS is_anonymous
  FROM users;

-- Up above
---
-- Down below

DROP VIEW user_role_detail;

CREATE VIEW user_role_detail AS
  SELECT
    users.id,
    users.username,
    users.personalname,
    users.email,
    users.email = '' OR users.email IS NULL OR users.hash IS NULL AS is_anonymous,
    users.single_use_password,
    (SELECT ARRAY_AGG(role) AS roles
      FROM user_role
      WHERE user_role.user_id = users.id),
    (SELECT COUNT(*) > 0 AS is_super
      FROM user_role
      WHERE user_role.user_id = users.id
      AND user_role.role = 'super_admin')
  FROM users;

ALTER TABLE users
    DROP COLUMN lastseen_at;
