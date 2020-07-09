CREATE TABLE scenario_lock (
  PRIMARY KEY (scenario_id, user_id, created_at, ended_at),
  scenario_id INT REFERENCES scenario(id),
  user_id INT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMPTZ
);

-- Up above
---
-- Down below

DROP TABLE scenario_lock;
