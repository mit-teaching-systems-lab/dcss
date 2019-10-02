CREATE TABLE slide (
    id SERIAL PRIMARY KEY,
    scenario_id INT NOT NULL REFERENCES scenario(id),
    slide_order INT NOT NULL, -- Later renamed "order" and given a default sequence
    components JSONB
    -- Later adds "title" TEXT NOT NULL
);

---

DROP TABLE slide;