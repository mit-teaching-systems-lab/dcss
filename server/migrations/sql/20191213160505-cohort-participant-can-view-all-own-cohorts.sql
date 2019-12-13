INSERT INTO role_permission (role, permission)
VALUES
    ('admin', 'view_own_cohorts'),
    ('participant', 'view_own_cohorts'),
    ('super_admin', 'view_own_cohorts')
;

-- Up above
---
-- Down below
DELETE FROM role_permission
WHERE permission = 'view_own_cohorts'
AND role IN ('super_admin', 'admin', 'researcher');
