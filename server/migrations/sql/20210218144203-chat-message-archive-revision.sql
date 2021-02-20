ALTER TABLE chat_message_archive
  ADD COLUMN is_joinpart BOOLEAN DEFAULT FALSE;

DROP TRIGGER IF EXISTS run_chat_trigger ON run;
DROP FUNCTION IF EXISTS run_chat_check;

CREATE FUNCTION run_chat_check() RETURNS trigger AS $$
DECLARE
BEGIN
  IF NEW.ended_at IS NOT NULL THEN
    WITH t AS (
      SELECT rv.chat_id AS chat_id
      FROM run_view rv
      WHERE rv.id = NEW.id
    )
    UPDATE chat
    SET ended_at = CURRENT_TIMESTAMP
    FROM t
    WHERE chat.id = t.chat_id
    AND chat.host_id = NEW.user_id;

    WITH t AS (
      SELECT
        rv.chat_id AS id,
        COUNT(
          CASE
            WHEN ended_at IS NULL THEN 1
            ELSE NULL
          END
        ) AS active_run_count
      FROM run_view rv
      WHERE rv.chat_id = (
        SELECT rv.chat_id
        FROM run_view rv
        WHERE rv.id = NEW.id
      )
      GROUP BY chat_id
    )
    UPDATE chat
    SET ended_at = CURRENT_TIMESTAMP
    FROM t
    WHERE chat.id = t.id
    AND t.active_run_count = 0;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER run_chat_trigger
  AFTER UPDATE ON run
  FOR EACH ROW EXECUTE PROCEDURE run_chat_check();


DROP TRIGGER IF EXISTS archive_chat_messages_trigger ON chat;
DROP FUNCTION IF EXISTS archive_chat_messages;

CREATE FUNCTION archive_chat_messages() RETURNS trigger AS $$
DECLARE
BEGIN
  IF OLD.ended_at IS NULL THEN
    -- RAISE EXCEPTION 'OLD.ended_at is null';

    IF NEW.ended_at IS NOT NULL THEN
      -- RAISE EXCEPTION 'NEW.ended_at is not null';
      WITH messages AS (
        DELETE FROM chat_message
        WHERE chat_id = NEW.id
        RETURNING *
      )
      INSERT INTO chat_message_archive
      SELECT * FROM messages;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER archive_chat_messages_trigger
  AFTER UPDATE ON chat
  FOR EACH ROW EXECUTE PROCEDURE archive_chat_messages();

-- Up above
---
-- Down below

ALTER TABLE chat_message_archive
  DROP COLUMN is_joinpart;

DROP TRIGGER IF EXISTS run_chat_trigger ON run;
DROP FUNCTION IF EXISTS run_chat_check;

CREATE FUNCTION run_chat_check() RETURNS trigger AS $$
DECLARE
BEGIN
  IF NEW.ended_at IS NOT NULL THEN
    WITH t AS (
      SELECT
        rv.chat_id AS id,
        COUNT(
          CASE
            WHEN ended_at IS NULL THEN 1
            ELSE NULL
          END
        ) AS active_run_count
      FROM run_view rv
      WHERE rv.chat_id = (
        SELECT rv.chat_id
        FROM run_view rv
        WHERE rv.id = NEW.id
      )
      GROUP BY chat_id
    )
    UPDATE chat
    SET ended_at = CURRENT_TIMESTAMP
    FROM t
    WHERE chat.id = t.id
    AND t.active_run_count = 0;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER run_chat_trigger
  AFTER UPDATE ON run
  FOR EACH ROW EXECUTE PROCEDURE run_chat_check();

DROP TRIGGER IF EXISTS archive_chat_messages_trigger ON chat;
DROP FUNCTION IF EXISTS archive_chat_messages;

CREATE FUNCTION archive_chat_messages() RETURNS trigger AS $$
DECLARE
BEGIN
  IF OLD.ended_at IS NULL AND NEW.ended_at IS NOT NULL THEN
    WITH messages AS (
      DELETE FROM chat_message
      WHERE chat_id = NEW.id
      RETURNING *
    )
    INSERT INTO chat_message_archive
    SELECT * FROM messages;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER archive_chat_messages_trigger
  AFTER UPDATE ON chat
  FOR EACH ROW EXECUTE PROCEDURE archive_chat_messages();
