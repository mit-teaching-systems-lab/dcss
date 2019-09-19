CREATE TABLE run_slide_response (
    id SERIAL PRIMARY KEY,
    run_id INT NOT NULL REFERENCES run(id),
    slide_id INT NOT NULL REFERENCES slide(id),
    response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ
);

---

DROP TABLE run_slide_response;
