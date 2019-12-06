CREATE TABLE audio_transcript (
    id SERIAL PRIMARY KEY,
    key VARCHAR,
    response JSONB,
    transcript TEXT CHECK(transcript <> ''),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Up above
---
-- Down below
DROP TABLE audio_transcript;
