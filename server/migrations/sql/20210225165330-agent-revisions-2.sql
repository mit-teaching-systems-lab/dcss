--
-- Set Rick Waldron as the owner of the default example agent
--
UPDATE agent SET owner_id = (
  SELECT id FROM users WHERE email = 'waldron.rick@gmail.com'
) WHERE id = 1;

--
-- This will trigger the agent_interaction_created_trigger
-- procedure and create an agent_user
--
INSERT INTO agent_interaction
  (id, agent_id, interaction_id)
VALUES
  (1, 1, 1);

CREATE VIEW agent_view AS
  WITH av AS (
    WITH au AS (
      SELECT
        urd.*,
        au.agent_id
      FROM user_role_detail urd
      JOIN agent_user au ON urd.id = au.user_id
    ), ai AS (
      SELECT
        ai.*,
        i.name
      FROM interaction i
      LEFT JOIN agent_interaction ai ON i.id = ai.interaction_id
    )
    SELECT
      agent.id,
      agent.created_at,
      agent.updated_at,
      agent.deleted_at,
      agent.is_active,
      agent.name,
      agent.description,
      agent.endpoint,
      JSONB_OBJECT(
        ARRAY_AGG(ac.key) FILTER (WHERE ac.key IS NOT NULL),
        ARRAY_AGG(ac.value)
      ) AS configuration,
      JSONB_AGG(TO_JSONB(ai) - 'agent_id' - 'interaction_id')::json->0 AS interaction,
      JSONB_AGG(TO_JSONB(urd))::json->0 AS owner,
      JSONB_AGG(TO_JSONB(au) - 'agent_id')::json->0 AS self
    FROM agent
    JOIN user_role_detail urd ON agent.owner_id = urd.id
    LEFT JOIN agent_configuration ac ON agent.id = ac.agent_id
    LEFT JOIN ai ON agent.id = ai.agent_id
    LEFT JOIN au ON agent.id = au.agent_id
    GROUP BY agent.id
  )
  SELECT
    id,
    created_at,
    updated_at,
    deleted_at,
    is_active,
    name,
    description,
    endpoint,
    COALESCE(av.configuration, '[]'::jsonb) AS configuration,
    av.interaction,
    av.owner,
    av.self
  FROM av;


-- Up above
---
-- Down below

DROP VIEW IF EXISTS agent_view;
DELETE FROM agent_interaction;
UPDATE agent SET owner_id = NULL WHERE id = 1;
