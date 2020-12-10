INSERT INTO event (name, template)
VALUES
(
  'chat-join',
  '{participant} joined a chat.'
),
(
  'chat-part',
  '{participant} left a chat.'
),
(
  'chat-message',
  '{participant} wrote in a chat.'
);

-- Up above
---
-- Down below

DELETE FROM event WHERE name LIKE 'chat-%';
