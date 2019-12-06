INSERT INTO role_permission (role, permission)
VALUES
    -- create_cohort            : can create cohorts
    -- edit_all_cohorts         : can edit all cohorts
    -- edit_own_cohorts         : can edit cohorts that I own
    -- view_all_cohorts         : can view all cohorts
    -- view_invited_cohorts     : can view cohorts that I was invited to
    -- view_own_cohorts         : can view cohorts that I own
    -- view_all_data            : can view all data
    -- view_own_data            : can view my own data
    -- view_consented_data      : can view all consented data
    -- view_scenarios_in_cohort : can view scenarios available to a cohort.
    -- edit_scenarios_in_cohort : can add, remove and reorder scenarios in a cohort.

    ('admin', 'create_cohort'),
    ('admin', 'edit_scenarios_in_cohort'),
    ('admin', 'view_scenarios_in_cohort'),
    ('admin', 'edit_all_cohorts'),
    ('admin', 'view_all_cohorts'),
    ('admin', 'view_all_data'),
    ('admin', 'view_consented_data'),

    ('facilitator', 'create_cohort'),
    ('facilitator', 'edit_scenarios_in_cohort'),
    ('facilitator', 'view_scenarios_in_cohort'),
    ('facilitator', 'edit_own_cohorts'),
    ('facilitator', 'view_all_cohorts'),
    ('facilitator', 'view_own_cohorts'),
    ('facilitator', 'view_all_data'),
    ('facilitator', 'view_consented_data'),

    ('participant', 'view_invited_cohorts'),
    ('participant', 'view_own_data'),
    ('participant', 'view_scenarios_in_cohort'),

    ('researcher', 'create_cohort'),
    ('researcher', 'edit_scenarios_in_cohort'),
    ('researcher', 'view_scenarios_in_cohort'),
    ('researcher', 'edit_own_cohorts'),
    ('researcher', 'view_all_cohorts'),
    ('researcher', 'view_invited_cohorts'),
    ('researcher', 'view_own_cohorts'),
    ('researcher', 'view_consented_data'),
    ('researcher', 'view_own_data'),

    ('super_admin', 'create_cohort'),
    ('super_admin', 'edit_scenarios_in_cohort'),
    ('super_admin', 'view_scenarios_in_cohort'),
    ('super_admin', 'edit_all_cohorts'),
    ('super_admin', 'edit_own_cohorts'),
    ('super_admin', 'view_all_cohorts'),
    ('super_admin', 'view_all_data'),
    ('super_admin', 'view_own_data'),
    ('super_admin', 'view_consented_data')
;

-- Up above
---
-- Down below
DELETE FROM role_permission
WHERE 1=1
OR permission = 'create_cohort'
OR permission = 'edit_all_cohorts'
OR permission = 'edit_own_cohorts'
OR permission = 'view_all_cohorts'
OR permission = 'view_invited_cohorts'
OR permission = 'view_own_cohorts'
OR permission = 'view_all_data'
OR permission = 'view_own_data'
OR permission = 'view_consented_data'
OR permission = 'view_scenarios_in_cohort'
OR permission = 'edit_scenarios_in_cohort'
;
