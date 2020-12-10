ALTER TABLE chat_user
  ADD COLUMN persona_id INT REFERENCES persona(id),
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN is_present BOOLEAN DEFAULT TRUE;

CREATE TRIGGER updated_at
  BEFORE UPDATE ON chat_user
  FOR EACH ROW EXECUTE PROCEDURE updated_at();


CREATE FUNCTION emit_join_or_part_chat() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify('join_or_part_chat', row_to_json(NEW)::text);
  RETURN new;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER chat_user_upsert_trigger
  AFTER INSERT OR UPDATE ON chat_user
  FOR EACH ROW EXECUTE PROCEDURE emit_join_or_part_chat();

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS chat_user_upsert_trigger ON chat_user;
DROP TRIGGER IF EXISTS updated_at ON chat_user;
DROP FUNCTION IF EXISTS emit_join_or_part_chat;

ALTER TABLE chat_user
  DROP COLUMN persona_id,
  DROP COLUMN updated_at,
  DROP COLUMN is_present;
