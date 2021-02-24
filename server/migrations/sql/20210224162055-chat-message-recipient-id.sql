ALTER TABLE chat_message
  ADD COLUMN recipient_id INT REFERENCES users(id) DEFAULT NULL;

ALTER TABLE chat_message_archive
  ADD COLUMN recipient_id INT DEFAULT NULL;

-- Up above
---
-- Down below

ALTER TABLE chat_message
  DROP COLUMN recipient_id;

ALTER TABLE chat_message_archive
  DROP COLUMN recipient_id;
