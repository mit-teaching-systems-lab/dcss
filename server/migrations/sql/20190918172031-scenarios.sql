CREATE TABLE scenario (
    id SERIAL PRIMARY KEY,
    author_id INT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL CHECK(title <> ''),
    description TEXT NOT NULL CHECK(description <> ''),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TRIGGER updated_at BEFORE UPDATE ON scenario
    FOR EACH ROW EXECUTE PROCEDURE updated_at();

---
DROP TABLE scenario;
