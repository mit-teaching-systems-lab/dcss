CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK(name <> ''),
    description TEXT NOT NULL CHECK(description <> '')
);

INSERT INTO status (name, description)
VALUES
    ('draft', 'Visible only to author'),
    ('public', 'Visible to everyone'),
    ('private', 'Visible only to logged in users');


ALTER TABLE scenario
    ADD COLUMN status INT REFERENCES status(id);

WITH stat AS (SELECT id AS status_id FROM status LIMIT 1)
UPDATE scenario SET status = (SELECT status_id FROM stat);

ALTER TABLE scenario
    ALTER COLUMN status SET NOT NULL;
-- Up above
---
-- Down below
ALTER TABLE scenario DROP COLUMN status;
DROP TABLE status;

