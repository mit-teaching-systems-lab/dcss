CREATE TABLE tag_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK(name <> '')
);

INSERT INTO tag_type (name)
VALUES
 ('category'),
 ('topic');

CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK(name <> ''),
    tag_type_id INT NOT NULL REFERENCES tag_type(id)
);

WITH cat AS (SELECT id, 'official' as tag FROM tag_type WHERE name='category')
INSERT INTO tag (name, tag_type_id)
SELECT tag, id from cat;

WITH cat AS (SELECT id, 'community' as tag FROM tag_type WHERE name='category')
INSERT INTO tag (name, tag_type_id)
SELECT tag, id from cat;


CREATE TABLE scenario_tag (
    scenario_id INT NOT NULL REFERENCES scenario(id),
    tag_id INT NOT NULL REFERENCES tag(id),
    PRIMARY KEY (scenario_id, tag_id)
);
-- Up above
---
-- Down below
DROP TABLE "tag_type" CASCADE;
DROP TABLE "tag" CASCADE;
DROP TABLE "scenario_tag";
