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
        (username, personalname)
      SELECT username, personalname FROM t
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

-- Up above
---
-- Down below


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
          md5(name::bytea) AS username,
          name AS personalname
        FROM agent
        WHERE id = NEW.agent_id
      )
      INSERT INTO users
        (username, personalname)
      SELECT username, personalname FROM t
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
