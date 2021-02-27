ALTER TABLE interaction
  ADD COLUMN description TEXT;


UPDATE interaction
SET description = 'It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.'
WHERE id = 1;

UPDATE interaction
SET description = 'It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Audio Prompt Responses.'
WHERE id = 2;

UPDATE interaction
SET description = 'It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Text Prompt Responses.'
WHERE id = 3;

-- Up above
---
-- Down below

ALTER TABLE interaction
  DROP COLUMN description;
