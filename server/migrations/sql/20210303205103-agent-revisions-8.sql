DROP VIEW IF EXISTS agent_view;

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
        ai.interaction_id AS id,
        ai.agent_id,
        ai.created_at,
        ai.deleted_at,
        ai.updated_at,
        i.name,
        i.description,
        i.types
      FROM interaction_view i
      -- This revision changed this join from a left join to regular join
      JOIN agent_interaction ai ON i.id = ai.interaction_id
    )
    SELECT
      agent.id,
      agent.created_at,
      agent.updated_at,
      agent.deleted_at,
      agent.is_active,
      agent.title,
      agent.name,
      agent.description,
      agent.endpoint,
      JSONB_OBJECT(
        ARRAY_AGG("asc".key) FILTER (WHERE "asc".key IS NOT NULL),
        ARRAY_AGG("asc".value)
      ) AS socket,
      JSONB_OBJECT(
        ARRAY_AGG(ac.key) FILTER (WHERE ac.key IS NOT NULL),
        ARRAY_AGG(ac.value)
      ) AS configuration,
      JSONB_AGG(TO_JSONB(ai) - 'agent_id')::json->0 AS interaction,
      JSONB_AGG(TO_JSONB(urd))::json->0 AS owner,
      JSONB_AGG(TO_JSONB(au) - 'agent_id')::json->0 AS self
    FROM agent
    JOIN user_role_detail urd ON agent.owner_id = urd.id
    -- This revision changed this join from a left join to regular join
    JOIN ai ON agent.id = ai.agent_id
    LEFT JOIN agent_socket_configuration "asc" ON agent.id = "asc".agent_id
    LEFT JOIN agent_configuration ac ON agent.id = ac.agent_id
    LEFT JOIN au ON agent.id = au.agent_id
    GROUP BY agent.id
  )
  SELECT
    id,
    created_at,
    updated_at,
    deleted_at,
    is_active,
    title,
    name,
    description,
    endpoint,
    COALESCE(av.socket, '[]'::jsonb) AS socket,
    COALESCE(av.configuration, '[]'::jsonb) AS configuration,
    av.interaction,
    av.owner,
    av.self
  FROM av;


-- Up above
---
-- Down below

DROP VIEW IF EXISTS agent_view;

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
        ai.interaction_id AS id,
        ai.agent_id,
        ai.created_at,
        ai.deleted_at,
        ai.updated_at,
        i.name,
        i.description,
        i.types
      FROM interaction_view i
      LEFT JOIN agent_interaction ai ON i.id = ai.interaction_id
    )
    SELECT
      agent.id,
      agent.created_at,
      agent.updated_at,
      agent.deleted_at,
      agent.is_active,
      agent.title,
      agent.name,
      agent.description,
      agent.endpoint,
      JSONB_OBJECT(
        ARRAY_AGG("asc".key) FILTER (WHERE "asc".key IS NOT NULL),
        ARRAY_AGG("asc".value)
      ) AS socket,
      JSONB_OBJECT(
        ARRAY_AGG(ac.key) FILTER (WHERE ac.key IS NOT NULL),
        ARRAY_AGG(ac.value)
      ) AS configuration,
      JSONB_AGG(TO_JSONB(ai) - 'agent_id')::json->0 AS interaction,
      JSONB_AGG(TO_JSONB(urd))::json->0 AS owner,
      JSONB_AGG(TO_JSONB(au) - 'agent_id')::json->0 AS self
    FROM agent
    JOIN user_role_detail urd ON agent.owner_id = urd.id
    LEFT JOIN agent_socket_configuration "asc" ON agent.id = "asc".agent_id
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
    title,
    name,
    description,
    endpoint,
    COALESCE(av.socket, '[]'::jsonb) AS socket,
    COALESCE(av.configuration, '[]'::jsonb) AS configuration,
    av.interaction,
    av.owner,
    av.self
  FROM av;

