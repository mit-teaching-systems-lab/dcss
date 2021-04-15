CREATE INDEX IF NOT EXISTS idx_audio_transcript_key
  ON audio_transcript(key);

-- Up above
---
-- Down below

DROP INDEX IF EXISTS idx_audio_transcript_key;
