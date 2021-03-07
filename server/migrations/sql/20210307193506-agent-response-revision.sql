ALTER TABLE agent_response
  ADD COLUMN prompt_response_id TEXT,
  ADD CONSTRAINT "unique_response" UNIQUE(response, recipient_id, response_id);

-- Up above
---
-- Down below

ALTER TABLE agent_response
  DROP COLUMN prompt_response_id,
  DROP CONSTRAINT "unique_response";
