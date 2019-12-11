
ALTER TABLE user_role
DROP CONSTRAINT "roles_user_id_fkey";

ALTER TABLE user_role
ADD CONSTRAINT "roles_user_id_fkey"
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;
---

ALTER TABLE user_role
DROP CONSTRAINT "roles_user_id_fkey";

ALTER TABLE user_role
ADD CONSTRAINT "roles_user_id_fkey"
    FOREIGN KEY(user_id)
    REFERENCES users(id);
