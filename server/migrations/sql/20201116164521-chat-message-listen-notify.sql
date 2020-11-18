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

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS chat_message_insert_trigger ON chat_message;
DROP FUNCTION IF EXISTS emit_new_chat_message;
