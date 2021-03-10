DROP TRIGGER IF EXISTS agent_interaction_created_trigger ON agent_interaction;
DROP FUNCTION IF EXISTS agent_interaction_created;

-- When a new agent is created, it will also create an
-- agent_interaction record. Some agent_interactions
-- require additional capabilities, ie. ChatPrompt,
-- which needs a special site-wide user association.
CREATE FUNCTION agent_interaction_created() RETURNS trigger AS $$
DECLARE
BEGIN
  IF NOT EXISTS (
    SELECT *
    FROM agent_user au
    WHERE au.agent_id = NEW.agent_id
  ) THEN
    WITH u AS (
      WITH t AS (
        SELECT
          -- this revision changed  md5(title::bytea) to
          -- substr(md5(random()::text), 0, 32)
          substr(md5(random()::text), 0, 32) AS username,
          title AS personalname
        FROM agent
        WHERE id = NEW.agent_id
      )
      INSERT INTO users
        (username, personalname, is_agent)
      SELECT username, personalname, TRUE FROM t
      RETURNING *
    )
    INSERT INTO agent_user (agent_id, user_id)
    VALUES (NEW.agent_id, (SELECT id FROM u))
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER agent_interaction_created_trigger
  AFTER INSERT OR UPDATE ON agent_interaction
  FOR EACH ROW EXECUTE PROCEDURE agent_interaction_created();

DROP TRIGGER IF EXISTS agent_name_updated_trigger ON agent;
DROP FUNCTION IF EXISTS agent_name_updated;

CREATE FUNCTION agent_name_updated() RETURNS trigger AS $$
DECLARE
BEGIN
  WITH u AS (
    SELECT
      user_id as id
    FROM agent_user
    WHERE agent_id = NEW.id
  )
  UPDATE
    users
  SET
    -- this revision removed updates to username
    personalname = NEW.title
  FROM u
  WHERE users.id = u.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER agent_name_updated_trigger
  AFTER UPDATE ON agent
  FOR EACH ROW EXECUTE PROCEDURE agent_name_updated();

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS agent_name_updated_trigger ON agent;
DROP FUNCTION IF EXISTS agent_name_updated;

CREATE FUNCTION agent_name_updated() RETURNS trigger AS $$
DECLARE
BEGIN
  WITH u AS (
    SELECT
      user_id as id
    FROM agent_user
    WHERE agent_id = NEW.id
  )
  UPDATE
    users
  SET
    username = md5(NEW.name::bytea),
    personalname = NEW.name
  FROM u
  WHERE users.id = u.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER agent_name_updated_trigger
  AFTER UPDATE ON agent
  FOR EACH ROW EXECUTE PROCEDURE agent_name_updated();

DROP TRIGGER IF EXISTS agent_interaction_created_trigger ON agent_interaction;
DROP FUNCTION IF EXISTS agent_interaction_created;

-- When a new agent is created, it will also create an
-- agent_interaction record. Some agent_interactions
-- require additional capabilities, ie. ChatPrompt,
-- which needs a special site-wide user association.
CREATE FUNCTION agent_interaction_created() RETURNS trigger AS $$
DECLARE
BEGIN
  IF NOT EXISTS (
    SELECT *
    FROM agent_user au
    WHERE au.agent_id = NEW.agent_id
  ) THEN
    WITH u AS (
      WITH t AS (
        SELECT
          -- this revision changed "name" to "title"
          md5(title::bytea) AS username,
          -- this revision changed "name" to "title"
          title AS personalname
        FROM agent
        WHERE id = NEW.agent_id
      )
      INSERT INTO users
        (username, personalname, is_agent)
      SELECT username, personalname, TRUE FROM t
      RETURNING *
    )
    INSERT INTO agent_user (agent_id, user_id)
    VALUES (NEW.agent_id, (SELECT id FROM u))
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER agent_interaction_created_trigger
  AFTER INSERT OR UPDATE ON agent_interaction
  FOR EACH ROW EXECUTE PROCEDURE agent_interaction_created();
