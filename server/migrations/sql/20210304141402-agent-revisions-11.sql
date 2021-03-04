ALTER TABLE agent_response
  DROP COLUMN context,
  ADD COLUMN chat_id INT REFERENCES chat(id),
  ADD COLUMN interaction_id INT REFERENCES interaction(id),
  ADD COLUMN recipient_id INT REFERENCES users(id),
  ADD COLUMN response_id INT REFERENCES run_response(id),
  ADD COLUMN run_id INT REFERENCES run(id);

-- Up above
---
-- Down below

ALTER TABLE agent_response
  ADD COLUMN context JSONB,
  DROP COLUMN chat_id,
  DROP COLUMN interaction_id,
  DROP COLUMN recipient_id,
  DROP COLUMN response_id,
  DROP COLUMN run_id;
