INSERT INTO role_permission (role, permission)
VALUES
    -- view_all_run_data     : can view all run data that has consent,
    -- ie. super_admin, researcher
    -- DO NOT APPLY TO Admin, Facilitator, Participant
    ('super_admin', 'view_all_run_data'),
    ('researcher', 'view_all_run_data');

-- Up above
---
-- Down below


DELETE FROM role_permission
WHERE permission = 'view_all_run_data';
