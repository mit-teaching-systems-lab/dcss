CREATE TABLE run (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    scenario_id INT NOT NULL REFERENCES scenario(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ
);

---

DROP TABLE run;