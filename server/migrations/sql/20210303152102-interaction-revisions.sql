ALTER TABLE interaction
  ADD COLUMN owner_id INT REFERENCES users(id);

--
-- Set Rick Waldron as the owner of the default example interactions
--
UPDATE interaction SET owner_id = (
  SELECT id FROM users WHERE email = 'waldron.rick@gmail.com'
) WHERE id IN (1, 2, 3);

DROP VIEW IF EXISTS interaction_view;

CREATE VIEW interaction_view AS
  SELECT
    i.id,
    i.name,
    i.description,
    i.created_at,
    i.updated_at,
    i.deleted_at,
    JSONB_AGG(TO_JSONB(urd.*))::json->0 AS owner
  FROM interaction i
  JOIN user_role_detail urd ON i.owner_id = urd.id
  GROUP BY i.id




-- Up above
---
-- Down below

DROP VIEW IF EXISTS interaction_view;

UPDATE interaction SET owner_id = NULL WHERE id IN (1, 2, 3);

ALTER TABLE interaction
  DROP COLUMN owner_id;
