ALTER TABLE roles 
  RENAME TO user_role;
ALTER TABLE user_role
  DROP COLUMN id,
  ADD PRIMARY KEY(user_id, role);

---

ALTER TABLE user_role 
    RENAME TO roles;
ALTER TABLE roles
    DROP CONSTRAINT user_role_pkey,
    ADD COLUMN id SERIAL PRIMARY KEY;
