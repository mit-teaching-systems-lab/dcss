
INSERT INTO role_permission (role, permission)
VALUES
    -- create_scenario       : can create scenarios
    -- edit_scenario         : can edit all scenarios
    -- edit_permissions      : can edit a user's permissions
    -- view_run_data         : can view participant's run data

    ('super_admin', 'create_scenario'),
    ('super_admin', 'edit_scenario'),
    ('super_admin', 'edit_permissions'),
    ('super_admin', 'view_run_data'),

    ('admin', 'create_scenario'),
    ('admin', 'edit_scenario'),
    ('admin', 'edit_permissions'),
    ('admin', 'view_run_data'),

    ('researcher', 'create_scenario'),
    ('researcher', 'view_run_data'),

    ('facilitator', 'create_scenario'),
    ('facilitator', 'view_run_data')
---

DELETE FROM role_permission
WHERE permission = 'create_scenario'
OR permission = 'edit_scenario'
OR permission = 'edit_permissions'
OR permission = 'view_run_data'
