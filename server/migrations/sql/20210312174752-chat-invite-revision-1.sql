DROP TRIGGER chat_invite_insert_trigger ON invite;
DROP FUNCTION emit_chat_invite;

CREATE FUNCTION emit_chat_invite() RETURNS trigger AS $$
DECLARE
  event_name TEXT := 'new_invitation';
BEGIN
  IF TG_OP = 'UPDATE' THEN
    event_name = 'set_invitation';

    --
    -- Auto decline all other pending invitations
    --

    IF NEW.status_id = 4 THEN
      UPDATE invite
      SET status_id = 3
      WHERE receiver_id = NEW.receiver_id
      AND id != NEW.id
      AND status_id = 1;
    END IF;

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

DROP TRIGGER chat_invite_insert_trigger ON invite;
DROP FUNCTION emit_chat_invite;

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
