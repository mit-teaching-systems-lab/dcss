CREATE TABLE log (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  capture JSONB
);

-- Up above
---
-- Down below

DROP TABLE log;
