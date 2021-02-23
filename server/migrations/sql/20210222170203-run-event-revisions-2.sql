DELETE FROM event WHERE name = 'event-name';

INSERT INTO event (name, template)
VALUES
(
  'chat-close-complete',
  '{participant} marked a chat as complete.'
),
(
  'chat-close-incomplete',
  '{participant} marked a chat as incomplete.'
),
(
  'chat-close-timeout',
  '{participant} finished a chat when the timer stopped.'
),
-- Placeholder --
(
  'event-name',
  'The description field will be used to store prose that illustrates how and when the event will occur.'
);

-- Up above
---
-- Down below

DELETE FROM event
WHERE name IN (
  'chat-close-complete',
  'chat-close-incomplete',
  'chat-close-timeout'
);
