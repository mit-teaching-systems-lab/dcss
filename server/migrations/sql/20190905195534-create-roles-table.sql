CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role VARCHAR NOT NULL CHECK (role IN ('super_admin', 'admin', 'researcher', 'facilitator', 'participant')),
    user_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

---

DROP TABLE roles;