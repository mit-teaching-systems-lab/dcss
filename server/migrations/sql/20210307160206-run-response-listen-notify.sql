DROP TRIGGER IF EXISTS run_response_insert_trigger ON run_response;
DROP FUNCTION IF EXISTS emit_new_run_response;

CREATE FUNCTION emit_run_response() RETURNS trigger AS $$
DECLARE
    event_name TEXT := 'run_response_created';
BEGIN
  IF TG_OP = 'UPDATE' THEN
    event_name = 'run_response_updated';
  END IF;

  PERFORM pg_notify(
    event_name,
    (
      SELECT
        row_to_json(run_response_view.*)::text
      FROM
        run_response_view
      WHERE
        id = NEW.id
    )
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER run_response_trigger
  AFTER INSERT OR UPDATE ON run_response
  FOR EACH ROW EXECUTE PROCEDURE emit_run_response();

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS run_response_trigger ON run_response;
DROP FUNCTION IF EXISTS emit_run_response;
