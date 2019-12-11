ALTER TABLE run
    ADD COLUMN referrer_params JSONB;
-- Up above
---
-- Down below
ALTER TABLE run
    DROP COLUMN referrer_params;
