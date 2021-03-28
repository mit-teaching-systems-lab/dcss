DELETE FROM event WHERE name = 'event-name';

INSERT INTO event (name, template)
VALUES
(
  'answer-annotation',
  '{participant} answered an annotation question.'
);

-- Up above
---
-- Down below

DELETE FROM event
WHERE name IN (
  'answer-annotation'
);
