DELETE FROM event WHERE name = 'event-name';

INSERT INTO event (name, template)
VALUES
(
  'response-sent-to-agent',
  '{participant}''s response was sent to an agent.'
),
(
  'agent-response-received',
  '{participant} received a response from an agent.'
),
(
  'agent-interjection-received',
  '{participant} received an interjection from an agent.'
),
(
  'shared-response-created',
  '{participant} created a response that is shared with their scenario partner.'
),
(
  'shared-response-updated',
  '{participant} updated a response that is shared with their scenario partner.'
),
(
  'user-join-slide',
  '{participant} joined the chat on a slide.'
),
(
  'user-part-slide',
  '{participant} parted the chat on a slide.'
),
(
  'chat-message-created',
  '{participant} sent a message to the chat.'
),
(
  'chat-closed-for-slide',
  '{participant} closed the chat.'
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
  'response-sent-to-agent',
  'agent-response-received',
  'agent-interjection-received',
  'shared-response-created',
  'shared-response-updated',
  'user-join-slide',
  'user-part-slide',
  'chat-message-created',
  'chat-closed-for-slide'
);



