DELETE FROM event WHERE name = 'event-name';

INSERT INTO event (name, template)
VALUES
(
  'user-join-pool',
  '{participant} requested to join {scenario} as {persona}, and is waiting to be matched.'
),
(
  'user-part-pool',
  '{participant} canceled their request to join {scenario} as {persona}.'
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
  'user-join-pool',
  'user-part-pool'
);
