ALTER TABLE audio_transcript
  DROP CONSTRAINT audio_transcript_transcript_check,
  ALTER COLUMN transcript SET DEFAULT NULL;

-- Up above
---
-- Down below
ALTER TABLE audio_transcript
  ADD CONSTRAINT audio_transcript_transcript_check CHECK(transcript <> '');
