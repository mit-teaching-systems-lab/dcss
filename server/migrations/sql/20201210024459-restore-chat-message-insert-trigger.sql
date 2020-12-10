CREATE TRIGGER chat_message_insert_trigger
  AFTER INSERT ON chat_message
  FOR EACH ROW EXECUTE PROCEDURE emit_new_chat_message();

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS chat_message_insert_trigger ON chat_message;

