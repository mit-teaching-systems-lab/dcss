DELETE FROM event WHERE name = 'event-name';

INSERT INTO event (name, template)
VALUES
(
  'answer-annotation',
  '{participant} answered an annotation question.'
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
  'answer-annotation'
);
