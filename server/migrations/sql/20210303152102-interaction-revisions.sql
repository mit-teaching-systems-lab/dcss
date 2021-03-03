CREATE TABLE interaction_type (
  id SERIAL PRIMARY KEY,
  name TEXT
);

INSERT INTO interaction_type (name)
VALUES
  ('AudioPrompt'),
  ('ChatPrompt'),
  ('ConversationPrompt'),
  ('TextResponse')
;

CREATE OR REPLACE FUNCTION check_interaction_type(TEXT[]) RETURNS BOOL AS $$
DECLARE
BEGIN
  IF EXISTS (
    SELECT v FROM UNNEST($1) AS v
    WHERE v NOT IN (SELECT name FROM interaction_type)
  ) THEN
    RETURN FALSE;
  END IF;
  RETURN TRUE;
END
$$ LANGUAGE plpgsql;

ALTER TABLE interaction
  ADD COLUMN owner_id INT REFERENCES users(id),
  ADD COLUMN types TEXT[] CHECK (check_interaction_type(types));

--
-- Set Rick Waldron as the owner of the default example interactions
--
UPDATE interaction SET owner_id = (
  SELECT id FROM users WHERE email = 'waldron.rick@gmail.com'
) WHERE id IN (1, 2, 3);

UPDATE interaction SET types = '{"ChatPrompt"}' WHERE id = 1;
UPDATE interaction SET types = '{"AudioPrompt", "ConversationPrompt"}' WHERE id = 2;
UPDATE interaction SET types = '{"TextResponse"}' WHERE id = 3;

DROP VIEW IF EXISTS interaction_view;

CREATE VIEW interaction_view AS
  SELECT
    i.id,
    i.name,
    i.description,
    i.types,
    i.created_at,
    i.updated_at,
    i.deleted_at,
    JSONB_AGG(TO_JSONB(urd.*))::json->0 AS owner
  FROM interaction i
  JOIN user_role_detail urd ON i.owner_id = urd.id
  GROUP BY i.id;

-- Up above
---
-- Down below

DROP VIEW IF EXISTS interaction_view;

ALTER TABLE interaction
  DROP COLUMN owner_id,
  DROP COLUMN types;

DROP FUNCTION IF EXISTS check_interaction_type;

DROP TABLE interaction_type;
