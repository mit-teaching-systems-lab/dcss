DROP TABLE IF EXISTS chat_user;
DROP TABLE IF EXISTS chat_message;
DROP TABLE IF EXISTS chat;

CREATE TABLE chat (
  id SERIAL PRIMARY KEY,
  lobby_id INT NOT NULL REFERENCES lobby(id),
  host_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  ended_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE chat_message (
  id SERIAL PRIMARY KEY,
  chat_id INT NOT NULL REFERENCES chat(id),
  user_id INT NOT NULL REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE chat_user (
  PRIMARY KEY (chat_id, user_id),
  chat_id INT NOT NULL REFERENCES chat(id),
  user_id INT NOT NULL REFERENCES users(id),
  is_muted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER updated_at
  BEFORE UPDATE ON chat
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at
  BEFORE UPDATE ON chat_message
  FOR EACH ROW EXECUTE PROCEDURE updated_at();


CREATE TABLE run_chat (
  PRIMARY KEY (run_id, chat_id, user_id),
  run_id INT NOT NULL REFERENCES run(id),
  chat_id INT NOT NULL REFERENCES chat(id),
  user_id INT NOT NULL REFERENCES users(id)
);

-- Up above
---
-- Down below

DROP TABLE run_chat;
DROP TABLE chat_user;
DROP TABLE chat_message;
DROP TABLE chat;

CREATE TABLE chat (
  id SERIAL PRIMARY KEY,
  lobby_id INT NOT NULL REFERENCES lobby(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE chat_message (
  id SERIAL PRIMARY KEY,
  chat_id INT NOT NULL REFERENCES chat(id),
  user_id INT NOT NULL REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE chat_user (
  PRIMARY KEY (chat_id, user_id),
  chat_id INT NOT NULL REFERENCES chat(id),
  user_id INT NOT NULL REFERENCES users(id),
  is_muted BOOLEAN DEFAULT FALSE
);

