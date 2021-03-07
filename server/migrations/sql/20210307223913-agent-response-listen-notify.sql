DROP TRIGGER IF EXISTS agent_response_trigger ON agent_response;

CREATE OR REPLACE FUNCTION emit_agent_response() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify('agent_response_created', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER agent_response_trigger
  AFTER INSERT OR UPDATE ON agent_response
  FOR EACH ROW EXECUTE PROCEDURE emit_agent_response();

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS agent_response_trigger ON agent_response;
DROP FUNCTION IF EXISTS emit_agent_response;
