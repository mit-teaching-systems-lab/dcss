-- ALTER USER root WITH SUPERUSER?
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE chat
  DROP COLUMN lobby_id,
  ADD COLUMN scenario_id INT REFERENCES scenario(id),
  ADD COLUMN cohort_id INT REFERENCES cohort(id),
  ADD COLUMN is_open BOOLEAN DEFAULT FALSE;

CREATE TABLE invite_status (
  id SERIAL PRIMARY KEY,
  status VARCHAR NOT NULL
);

INSERT INTO invite_status (id, status)
VALUES (1, 'pending'), (2, 'canceled'), (3, 'declined'), (4, 'accepted');

CREATE TABLE invite (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id),
  receiver_id INT REFERENCES users(id),
  status_id INT REFERENCES invite_status(id) DEFAULT 1,
  props JSONB,
  --
  -- Example:
  --
  --  props: {
  --    chat_id INT REFERENCES chat(id),
  --    persona_id INT REFERENCES persona(id),
  --  }
  --
  code UUID DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  expire_at TIMESTAMPTZ -- A NULL value indicates no expiration
);

ALTER TABLE invite
  ADD CONSTRAINT sender_receiver_props UNIQUE (sender_id, receiver_id, props);

CREATE TRIGGER updated_at
  BEFORE UPDATE ON invite
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE VIEW chat_invite AS
  WITH ci AS (
    SELECT
      i.id,
      i.sender_id,
      i.receiver_id,
      (i.props->>'chat_id')::int AS chat_id,
      (i.props->>'persona_id')::int AS persona_id,
      i.code,
      i.created_at,
      i.updated_at,
      i.expire_at,
      s.status
    FROM invite i
    JOIN invite_status s ON i.status_id = s.id
    ORDER BY i.id
  )
  SELECT
    ci.*,
    chat.cohort_id,
    chat.scenario_id
  FROM ci
  JOIN chat ON chat.id = ci.chat_id;


CREATE FUNCTION emit_chat_invite() RETURNS trigger AS $$
DECLARE
  event_name TEXT := 'new_invitation';
BEGIN
  IF TG_OP = 'UPDATE' THEN
    event_name = 'set_invitation';
  END IF;

  PERFORM pg_notify(
    event_name,
    (
      SELECT
        row_to_json(chat_invite.*)::text
      FROM
        chat_invite
      WHERE
        id = NEW.id
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER chat_invite_insert_trigger
  AFTER INSERT OR UPDATE ON invite
  FOR EACH ROW EXECUTE PROCEDURE emit_chat_invite();

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS chat_invite_insert_trigger ON invite;
DROP FUNCTION IF EXISTS emit_chat_invite;
DROP VIEW chat_invite;
DROP TRIGGER updated_at ON invite;
DROP TABLE invite;
DROP TABLE invite_status;
ALTER TABLE chat
  DROP COLUMN is_open,
  DROP COLUMN cohort_id,
  DROP COLUMN scenario_id,
  ADD COLUMN lobby_id INT NOT NULL REFERENCES lobby(id) DEFAULT 1;



