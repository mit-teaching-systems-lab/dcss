CREATE TABLE partnering (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL CHECK(description <> ''),
  instruction TEXT NOT NULL CHECK(instruction <> '')
);

CREATE INDEX IF NOT EXISTS idx_partnering_description
  ON partnering(description);

CREATE INDEX IF NOT EXISTS idx_partnering_instruction
  ON partnering(instruction);

INSERT INTO partnering (id, description, instruction)
VALUES
(
  1,
  'Allow participants to create open or closed chat rooms. Participants will be able to create rooms and send invites to specific members of the cohort, or create rooms that are open to anyone in the cohort to join.',
  'Choose one of the following partnering options, then click on the role you will play in the scenario.'
),
(
  2,
  'Allow participants to create only closed chat rooms. Participants create a room by first selecting their own role, then sending invites to one or more selected partners with assigned roles. Automatic partnering is disabled.',
  'Choose the role you will play in the scenario; you will then be prompted to select one or more partners, assign their roles and send invites for them to join you.'
),
(
  3,
  'Allow participants to create only open chat rooms. Participants create a room by selecting a role, while other members of the cohort are free to choose any role. Once the scenario''s role are filled, participants will be automatically partnered. Invitation partnering is disabled.',
  'Choose the role you will play in the scenario; another participant will be partnered with you automatically.'
);

ALTER TABLE cohort_scenario
  ADD COLUMN partnering_id INT REFERENCES partnering(id) DEFAULT 1;


CREATE INDEX IF NOT EXISTS idx_cohort_scenario_partnering_id
  ON cohort_scenario(partnering_id);

-- Up above
---
-- Down below

DROP INDEX IF EXISTS idx_cohort_scenario_partnering_id;

UPDATE cohort_scenario
  SET partnering_id = NULL;

ALTER TABLE cohort_scenario
  DROP COLUMN partnering_id;

DROP INDEX IF EXISTS idx_partnering_description;
DROP INDEX IF EXISTS idx_partnering_instruction;

DROP TABLE partnering;
