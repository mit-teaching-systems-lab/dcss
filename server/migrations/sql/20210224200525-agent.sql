CREATE TABLE agent (
  id SERIAL PRIMARY KEY,
  owner_id INT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  endpoint TEXT,
  name TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO agent (id, endpoint, name, description)
VALUES (1, 'ws://emoji-analysis-production.herokuapp.com', 'Emoji Analysis', 'Detects the presense of an emoji character in your text');

--
-- key/value pairs used when connecting to the agent's socket.
-- Example: auth credentials
--
CREATE TABLE agent_socket_configuration (
  id SERIAL PRIMARY KEY,
  agent_id INT NOT NULL REFERENCES agent(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  key TEXT, -- this can be an object path
  value TEXT
);


CREATE TABLE interaction (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  name TEXT
);

INSERT INTO interaction
  (id, name)
VALUES
  (1, 'ChatPrompt'),
  (2, 'AudioPrompt'),
  (3, 'TextPrompt');

CREATE TABLE agent_interaction (
  id SERIAL PRIMARY KEY,
  agent_id INT NOT NULL REFERENCES agent(id),
  interaction_id INT NOT NULL REFERENCES interaction(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- This is used for chat agents that must have a user
-- association in order to participate in the chat.
CREATE TABLE agent_user (
  PRIMARY KEY (agent_id, user_id),
  agent_id INT NOT NULL REFERENCES agent(id),
  user_id INT NOT NULL REFERENCES users(id),
  is_muted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER updated_at
  BEFORE UPDATE ON agent
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at
  BEFORE UPDATE ON agent_socket_configuration
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at
  BEFORE UPDATE ON interaction
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at
  BEFORE UPDATE ON agent_interaction
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at
  BEFORE UPDATE ON agent_user
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS updated_at ON agent;
DROP TRIGGER IF EXISTS updated_at ON agent_socket_configuration;
DROP TRIGGER IF EXISTS updated_at ON interaction;
DROP TRIGGER IF EXISTS updated_at ON agent_interaction;
DROP TRIGGER IF EXISTS updated_at ON agent_user;

DROP TABLE IF EXISTS agent_user;
DROP TABLE IF EXISTS agent_interaction;
DROP TABLE IF EXISTS interaction;
DROP TABLE IF EXISTS agent_socket_configuration;
DROP TABLE IF EXISTS agent;
