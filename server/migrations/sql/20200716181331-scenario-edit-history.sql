-- CREATE TABLE scenario_snapshot (
--   id SERIAL PRIMARY KEY,
--   user_id INT NOT NULL REFERENCES users(id),
--   scenario_id INT NOT NULL REFERENCES scenario(id),
--   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   snapshot JSONB
-- );


CREATE TABLE scenario_snapshot (
  PRIMARY KEY (scenario_id, user_id, snapshot),
  scenario_id INT NOT NULL REFERENCES scenario(id),
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  snapshot JSONB
);

---

DROP TABLE scenario_snapshot;
