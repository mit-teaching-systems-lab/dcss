CREATE VIEW chat_message_archives AS
  SELECT
    cma.id,
    cma.chat_id,
    cma.user_id,
    cma.content,
    cma.created_at,
    cma.updated_at,
    cma.deleted_at,
    cma.is_quotable,
    cma.is_joinpart,
    cma.response_id,
    cma.recipient_id,
    p.id as role_persona_id,
    p.name as role_persona_name,
    p.description as role_persona_description
  FROM chat_message_archive AS cma
  JOIN chat_user cu ON cu.chat_id = cma.chat_id AND cu.user_id = cma.user_id
  JOIN persona p ON cu.persona_id = p.id;

-- Up above
---
-- Down below
DROP VIEW chat_message_archives;
