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

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS archive_chat_messages_trigger ON chat;
DROP FUNCTION IF EXISTS archive_chat_messages;
