INSERT INTO role_permission (role, permission)
VALUES ('facilitator', 'edit_scenario');

---

DELETE FROM role_permission
WHERE role = 'facilitator'
AND permission = 'edit_scenario';
