CREATE FUNCTION emit_chat_created() RETURNS trigger AS $$
DECLARE
  event_name TEXT := 'chat_created';
BEGIN
  IF TG_OP = 'UPDATE' THEN
    event_name = 'chat_updated';
  END IF;

  IF NEW.ended_at IS NULL THEN
    PERFORM pg_notify(event_name, row_to_json(NEW)::text);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER chat_created_insert_trigger
  AFTER INSERT OR UPDATE ON chat
  FOR EACH ROW EXECUTE PROCEDURE emit_chat_created();

-- Up above
---
-- Down below
DROP TRIGGER IF EXISTS chat_created_insert_trigger ON chat;
DROP FUNCTION IF EXISTS emit_chat_created;
