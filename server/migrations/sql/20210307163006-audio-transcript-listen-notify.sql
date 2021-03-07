DROP TRIGGER IF EXISTS audio_transcript_trigger ON audio_transcript;

CREATE OR REPLACE FUNCTION emit_audio_transcript() RETURNS trigger AS $$
DECLARE
    event_name TEXT := 'audio_transcript_created';
BEGIN
  IF TG_OP = 'UPDATE' THEN
    event_name = 'audio_transcript_updated';
  END IF;

  PERFORM pg_notify(event_name, row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER audio_transcript_trigger
  AFTER INSERT OR UPDATE ON audio_transcript
  FOR EACH ROW EXECUTE PROCEDURE emit_audio_transcript();

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS audio_transcript_trigger ON audio_transcript;
DROP FUNCTION IF EXISTS emit_audio_transcript;
