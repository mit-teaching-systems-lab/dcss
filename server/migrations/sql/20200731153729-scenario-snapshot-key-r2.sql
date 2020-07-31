DROP TABLE scenario_snapshot;

CREATE TABLE scenario_snapshot (
  id SERIAL PRIMARY KEY,
  scenario_id INT NOT NULL REFERENCES scenario(id),
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  snapshot JSONB
);

-- Up above
---
-- Down below

DROP TABLE scenario_snapshot;

CREATE TABLE scenario_snapshot (
  PRIMARY KEY (scenario_id, user_id, snapshot),
  scenario_id INT NOT NULL REFERENCES scenario(id),
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  snapshot JSONB
);
