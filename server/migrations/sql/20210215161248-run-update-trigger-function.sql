CREATE FUNCTION run_chat_check() RETURNS trigger AS $$
DECLARE
BEGIN
  IF NEW.ended_at IS NOT NULL THEN
    WITH t AS (
      SELECT
        rv.chat_id AS id,
        COUNT(
          CASE
            WHEN ended_at IS NULL THEN 1
            ELSE NULL
          END
        ) AS active_run_count
      FROM run_view rv
      WHERE rv.chat_id = (
        SELECT rv.chat_id
        FROM run_view rv
        WHERE rv.id = NEW.id
      )
      GROUP BY chat_id
    )
    UPDATE chat
    SET ended_at = CURRENT_TIMESTAMP
    FROM t
    WHERE chat.id = t.id
    AND t.active_run_count = 0;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER run_chat_trigger
  AFTER UPDATE ON run
  FOR EACH ROW EXECUTE PROCEDURE run_chat_check();

-- Up above
---
-- Down below

DROP TRIGGER IF EXISTS run_chat_trigger ON run;
DROP FUNCTION IF EXISTS run_chat_check;
