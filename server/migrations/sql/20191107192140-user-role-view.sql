CREATE VIEW user_role_detail AS
SELECT
    users.id,
    users.username,
    users.email,
    (SELECT ARRAY_AGG(role) AS roles from user_role WHERE user_role.user_id = users.id)
FROM users;

---

DROP VIEW user_role_detail;
