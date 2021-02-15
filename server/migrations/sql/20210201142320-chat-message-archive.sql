CREATE TABLE chat_message_archive (
  id INT NOT NULL,
  chat_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  is_quotable BOOLEAN DEFAULT true
);
-- Up above
---
-- Down below
DROP TABLE chat_message_archive;
