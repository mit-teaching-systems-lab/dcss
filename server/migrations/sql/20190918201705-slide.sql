CREATE TABLE slide (
    id SERIAL PRIMARY KEY,
    scenario_id INT NOT NULL REFERENCES scenario(id),
    slide_order INT NOT NULL,
    components JSONB
);

---

DROP TABLE slide;