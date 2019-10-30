CREATE VIEW categories AS
    SELECT tag.id, tag.name
    FROM tag
    INNER JOIN
        (
            SELECT id
            FROM tag_type
            WHERE name='category'
        ) tt ON
    tt.id = tag.tag_type_id;
-- Up above
---
-- Down below
DROP VIEW categories;
