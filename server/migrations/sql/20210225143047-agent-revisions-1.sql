--
-- key/value pairs used to configure the remote agent.
-- These are controlled via the AI integration admin panel.
--
CREATE TABLE agent_configuration (
  id SERIAL PRIMARY KEY,
  agent_id INT NOT NULL REFERENCES agent(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  key TEXT, -- this can be an object path
  value TEXT
);

CREATE TRIGGER updated_at
  BEFORE UPDATE ON agent_configuration
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

--
CREATE TABLE agent_response (
  id SERIAL PRIMARY KEY,
  agent_id INT NOT NULL REFERENCES agent(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  context JSONB,
  response JSONB
);

CREATE TRIGGER updated_at
  BEFORE UPDATE ON agent_response
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

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


-- If the agent's name is changed, we need to change the "self"
-- user that was created above.
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

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS agent_name_updated_trigger ON agent;
DROP FUNCTION IF EXISTS agent_name_updated;

DROP TRIGGER IF EXISTS agent_interaction_created_trigger ON agent_interaction;
DROP FUNCTION IF EXISTS agent_interaction_created;

DROP TRIGGER IF EXISTS updated_at ON agent_response;
DROP TRIGGER IF EXISTS updated_at ON agent_configuration;

DROP TABLE IF EXISTS agent_response;
DROP TABLE IF EXISTS agent_configuration;
