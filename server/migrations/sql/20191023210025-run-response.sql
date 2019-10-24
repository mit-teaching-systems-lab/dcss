ALTER TABLE run_slide_response RENAME TO run_response;

ALTER TABLE run_response DROP COLUMN slide_id;
ALTER TABLE run_response ADD COLUMN response_id TEXT NOT NULL DEFAULT '';
CREATE UNIQUE INDEX run_id_response_id on run_response (run_id, response_id);

CREATE TRIGGER updated_at BEFORE UPDATE ON run_response
    FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at BEFORE UPDATE ON run
    FOR EACH ROW EXECUTE PROCEDURE updated_at();

-- Up above
---
-- Down below

DROP TRIGGER updated_at ON run_response;
DROP TRIGGER updated_at ON run;

DROP INDEX run_id_response_id;
ALTER TABLE run_response ADD COLUMN slide_id INT REFERENCES slide(id);
ALTER TABLE run_response DROP COLUMN response_id;

ALTER TABLE run_response RENAME TO run_slide_response;
