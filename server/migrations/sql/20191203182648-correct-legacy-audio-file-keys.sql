BEGIN;
ALTER TABLE run_response DISABLE TRIGGER updated_at;
WITH audioresponse AS (
    SELECT
        id,
        response_id,
        regexp_replace(response::text, 's3\:\/\/v2-moments-dev\/(dev|staging)\/', '')::jsonb as response
    FROM run_response
    WHERE response_id LIKE 'AudioResponse%'
)
UPDATE run_response
   SET response = audioresponse.response
  FROM audioresponse
 WHERE audioresponse.id = run_response.id;
ALTER TABLE run_response ENABLE TRIGGER updated_at;
COMMIT;
-- Up above
---
-- Down below
