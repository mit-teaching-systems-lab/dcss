CREATE TABLE persona (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE scenario_persona (
  PRIMARY KEY (scenario_id, persona_id),
  scenario_id INT NOT NULL REFERENCES scenario(id),
  persona_id INT NOT NULL REFERENCES persona(id),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TRIGGER updated_at
  BEFORE UPDATE ON persona
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at
  BEFORE UPDATE ON scenario_persona
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

-- Up above
---
-- Down below

DROP TRIGGER updated_at ON persona;
DROP TRIGGER updated_at ON scenario_persona;

DROP TABLE persona;
DROP TABLE scenario_persona;
