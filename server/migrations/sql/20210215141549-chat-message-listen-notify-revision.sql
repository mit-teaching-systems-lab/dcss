DROP TRIGGER IF EXISTS chat_message_insert_trigger ON chat_message;
DROP FUNCTION IF EXISTS emit_new_chat_message;

CREATE FUNCTION emit_chat_message() RETURNS trigger AS $$
DECLARE
    event_name TEXT := 'chat_message_created';
BEGIN
  IF TG_OP = 'UPDATE' THEN
    event_name = 'chat_message_updated';
  END IF;

  PERFORM pg_notify(event_name, row_to_json(NEW)::text);
  RETURN new;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER chat_message_trigger
  AFTER INSERT OR UPDATE ON chat_message
  FOR EACH ROW EXECUTE PROCEDURE emit_chat_message();

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS chat_message_trigger ON chat_message;
DROP FUNCTION IF EXISTS emit_chat_message;

CREATE FUNCTION emit_new_chat_message() RETURNS trigger AS $$
DECLARE
BEGIN
 PERFORM pg_notify('new_chat_message', row_to_json(NEW)::text);
 RETURN new;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER chat_message_insert_trigger
  AFTER INSERT ON chat_message
  FOR EACH ROW EXECUTE PROCEDURE emit_new_chat_message();
