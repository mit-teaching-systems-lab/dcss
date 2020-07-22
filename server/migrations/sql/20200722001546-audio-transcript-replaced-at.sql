ALTER TABLE audio_transcript
    ADD COLUMN replaced_at TIMESTAMPTZ;

-- Up above
---
-- Down below

ALTER TABLE audio_transcript
    DROP COLUMN replaced_at;

