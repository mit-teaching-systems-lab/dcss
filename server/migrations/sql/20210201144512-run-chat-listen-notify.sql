CREATE FUNCTION emit_run_chat_link() RETURNS trigger AS $$
DECLARE
BEGIN
 PERFORM pg_notify('run_chat_link', row_to_json(NEW)::text);
 RETURN new;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER run_chat_insert_trigger
  AFTER INSERT ON run_chat
  FOR EACH ROW EXECUTE PROCEDURE emit_run_chat_link();

-- Up above
---
-- Down below
DROP TRIGGER IF EXISTS run_chat_insert_trigger ON run_chat;
DROP FUNCTION IF EXISTS emit_run_chat_link;
