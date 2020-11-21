INSERT INTO tag_type (name) VALUES ('label');


CREATE VIEW labels AS
    SELECT tag.id, tag.name
    FROM tag
    INNER JOIN
        (
            SELECT id
            FROM tag_type
            WHERE name='label'
        ) tt ON
    tt.id = tag.tag_type_id;

-- Up above
---
-- Down below
DELETE FROM tag_type WHERE name = 'label';
DROP VIEW labels;
