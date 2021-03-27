CREATE UNIQUE INDEX chat_user_persona_id_unique_when_not_null
    ON chat_user
       (chat_id, persona_id)
 WHERE persona_id IS NOT NULL;

CREATE UNIQUE INDEX chat_user_persona_id_unique_when_null
    ON chat_user
       (chat_id, persona_id)
 WHERE persona_id IS NULL;

-- Up above
---
-- Down below

DROP INDEX chat_user_persona_id_unique_when_not_null;
DROP INDEX chat_user_persona_id_unique_when_null;
