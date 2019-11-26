CREATE TABLE role_permission (
    role VARCHAR NOT NULL CHECK (role IN ('super_admin', 'admin', 'researcher', 'facilitator', 'participant')),
    permission VARCHAR NOT NULL
);
---

DROP TABLE role_permission;
