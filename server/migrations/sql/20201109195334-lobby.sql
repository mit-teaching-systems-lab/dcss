CREATE TABLE lobby (
  id SERIAL PRIMARY KEY,
  run_id INT NOT NULL REFERENCES run(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE lobby_user (
  id SERIAL PRIMARY KEY,
  lobby_id INT NOT NULL REFERENCES lobby(id),
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TRIGGER updated_at
  BEFORE UPDATE ON lobby
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at
  BEFORE UPDATE ON lobby_user
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

-- Up above
---
-- Down below

DROP TRIGGER updated_at ON lobby;
DROP TRIGGER updated_at ON lobby_user;

DROP TABLE lobby;
DROP TABLE lobby_user;
