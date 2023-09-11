CREATE TABLE race (
  id SERIAL PRIMARY KEY,
  description TEXT UNIQUE NOT NULL CHECK(description <> '')
);

CREATE INDEX IF NOT EXISTS idx_race_description
  ON race(description);

INSERT INTO race (description)
VALUES
  ('American Indian or Alaska Native'),
  ('Asian'),
  ('Black or African American'),
  ('Native Hawaiian or Other Pacific Islander'),
  ('White')
  ;


CREATE TABLE ethnicity (
  id SERIAL PRIMARY KEY,
  description TEXT UNIQUE NOT NULL CHECK(description <> '')
);

CREATE INDEX IF NOT EXISTS idx_ethnicity_description
  ON ethnicity(description);

INSERT INTO ethnicity (description)
VALUES
  ('Hispanic or Latino'),
  ('Not Hispanic or Latino')
  ;

CREATE TABLE gender_identity (
  id SERIAL PRIMARY KEY,
  description TEXT UNIQUE NOT NULL CHECK(description <> '')
);

CREATE INDEX IF NOT EXISTS idx_gender_identity_description
  ON gender_identity(description);

INSERT INTO gender_identity (description)
VALUES
  ('they/them'),
  ('she/her'),
  ('he/him')
  ;


ALTER TABLE users
  ADD COLUMN age INT,
  ADD COLUMN gender_identity TEXT,
  ADD COLUMN race TEXT,
  ADD COLUMN ethnicity TEXT
  ;

CREATE INDEX IF NOT EXISTS idx_users_age
  ON users(age);
CREATE INDEX IF NOT EXISTS idx_users_gender_identity
  ON users(gender_identity);
CREATE INDEX IF NOT EXISTS idx_users_race
  ON users(race);
CREATE INDEX IF NOT EXISTS idx_users_ethnicity
  ON users(ethnicity);


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
    users.is_agent,
    users.age,
    users.gender_identity,
    users.race,
    users.ethnicity
  FROM users;


-- Up above
---
-- Down below

-- 1. Drop the dependent views
DROP VIEW IF EXISTS agent_view;
DROP VIEW IF EXISTS interaction_view;
-- 2. Drop the target view to be replaced
DROP VIEW IF EXISTS user_role_detail;
-- 3. Replace the view
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

-- 4.a. Replace the dependent views
CREATE VIEW interaction_view AS
  SELECT
    i.id,
    i.name,
    i.description,
    i.types,
    i.created_at,
    i.updated_at,
    i.deleted_at,
    JSONB_AGG(TO_JSONB(urd.*))::json->0 AS owner
  FROM interaction i
  JOIN user_role_detail urd ON i.owner_id = urd.id
  GROUP BY i.id;

-- 4.b. Replace the dependent views
CREATE VIEW agent_view AS
  WITH av AS (
    WITH au AS (
      SELECT
        urd.*,
        au.agent_id
      FROM user_role_detail urd
      JOIN agent_user au ON urd.id = au.user_id
    ), ai AS (
      SELECT
        ai.interaction_id AS id,
        ai.agent_id,
        ai.created_at,
        ai.deleted_at,
        ai.updated_at,
        i.name,
        i.description,
        i.types
      FROM interaction_view i
      -- This revision changed this join from a left join to regular join
      JOIN agent_interaction ai ON i.id = ai.interaction_id
    )
    SELECT
      agent.id,
      agent.created_at,
      agent.updated_at,
      agent.deleted_at,
      agent.is_active,
      agent.title,
      agent.name,
      agent.description,
      agent.endpoint,
      JSONB_OBJECT(
        ARRAY_AGG("asc".key) FILTER (WHERE "asc".key IS NOT NULL),
        ARRAY_AGG("asc".value)
      ) AS socket,
      JSONB_OBJECT(
        ARRAY_AGG(ac.key) FILTER (WHERE ac.key IS NOT NULL),
        ARRAY_AGG(ac.value)
      ) AS configuration,
      JSONB_AGG(TO_JSONB(ai) - 'agent_id')::json->0 AS interaction,
      JSONB_AGG(TO_JSONB(urd))::json->0 AS owner,
      JSONB_AGG(TO_JSONB(au) - 'agent_id')::json->0 AS self
    FROM agent
    JOIN user_role_detail urd ON agent.owner_id = urd.id
    -- This revision changed this join from a left join to regular join
    JOIN ai ON agent.id = ai.agent_id
    LEFT JOIN agent_socket_configuration "asc" ON agent.id = "asc".agent_id
    LEFT JOIN agent_configuration ac ON agent.id = ac.agent_id
    LEFT JOIN au ON agent.id = au.agent_id
    GROUP BY agent.id
  )
  SELECT
    id,
    created_at,
    updated_at,
    deleted_at,
    is_active,
    title,
    name,
    description,
    endpoint,
    -- This revision changes these from empty arrays to empty objects
    COALESCE(av.socket, '{}'::jsonb) AS socket,
    COALESCE(av.configuration, '{}'::jsonb) AS configuration,
    av.interaction,
    av.owner,
    av.self
  FROM av;


DROP INDEX IF EXISTS idx_race_description;
DROP INDEX IF EXISTS idx_ethnicity_description;
DROP INDEX IF EXISTS idx_users_age;
DROP INDEX IF EXISTS idx_users_gender_identity;
DROP INDEX IF EXISTS idx_users_race;
DROP INDEX IF EXISTS idx_users_ethnicity;

ALTER TABLE users
  DROP COLUMN age,
  DROP COLUMN gender_identity,
  DROP COLUMN race,
  DROP COLUMN ethnicity;

DROP TABLE IF EXISTS race;
DROP TABLE IF EXISTS ethnicity;
DROP TABLE IF EXISTS gender_identity;
