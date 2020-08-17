CREATE VIEW audio_transcripts AS
  SELECT *
  FROM audio_transcript
  WHERE replaced_at IS NULL
  ORDER BY created_at DESC;

-- Up above
---
-- Down below
DROP VIEW audio_transcripts;
