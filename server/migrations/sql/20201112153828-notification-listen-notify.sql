-- DROP TRIGGER IF EXISTS notification_insert_trigger ON notification;
-- DROP FUNCTION IF EXISTS emit_new_notification;

CREATE FUNCTION emit_new_notification() RETURNS trigger AS $$
DECLARE
BEGIN
 PERFORM pg_notify('new_notification', row_to_json(NEW)::text);
 RETURN new;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER notification_insert_trigger
  AFTER INSERT ON notification
  FOR EACH ROW EXECUTE PROCEDURE emit_new_notification();

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS notification_insert_trigger ON notification;
DROP FUNCTION IF EXISTS emit_new_notification;
