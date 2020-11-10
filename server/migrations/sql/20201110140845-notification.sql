-- Purge the earlier, unused notification table
DROP TABLE IF EXISTS notification;

CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    starts_at TIMESTAMPTZ DEFAULT NULL,
    expires_at TIMESTAMPTZ DEFAULT NULL,
    props JSONB,
    rules JSONB,
    type VARCHAR NOT NULL CHECK (
      type IN ('band', 'modal', 'toast')
    )
);

-- `content` contains the HTML that will be displayed in the
-- notification. This is where action items must be placed, eg.:
--
--  - link to a scenario run
--  - link to a cohort
--  - link to a scenario run within a cohort
--  - link to settings
--  - link to login
--  - link to logout
--
--
-- `props` describe the props that will be passed to the component
--
--
-- {
--    title: String
--    description: String
--    className: String
--    type: error | info | success | warning
--    color:
--      red | orange | yellow | olive | green | teal | blue |
--      violet | purple | pink | brown | grey | black
--    icon: icon name,
--    size: mini | tiny | small | large | big | huge | massive
--    timeout: seconds until notification dissappears, defaults to
-- }
--
-- `type` describe what kind of display type the notification is.
--
-- band: a full width ribbon across the web page,
--        persists until expiration.
-- modal: a modal pop up,
--        persists until dismissed.
-- toast: a toast notification,
--        persists until dismissed.
--
--
-- `rules` describe when/if a user sees a notification
-- {
--    // All rules are optional
--
--    isLoggedIn: true | false
--
--    // To limit display to within a specific cohort
--    cohort_id: Number
--
--    // To limit display to within a specific scenario run
--    scenario_id: Number
--
--    // To limit display to a specific user
--    user_id: Number
--
--
--    //  Site wide roles:
--    roles: [super_admin | admin | researcher | facilitator | participant]
--
--    // If a cohort_id exists, these roles are:
--    roles: [owner | researcher | facilitator | participant]
--
--    // If a scenario_id exists, these roles are:
--    roles: [owner | author | reviewer]
--
--    // If a user_id exists, these roles are:
--    roles: []
--
--    permission: (
--      see:
--        20191205174533-role-permission-participant.sql
--        20191212213533-add-basic-permissions.sql
--    ),
-- }
--
-- Example rules:
--
-- Show a notification to everyone that's in the "X" cohort (id: 1):
--
-- {
--    isLoggedIn: true,
--    cohort_id: 1
-- }
--
--
-- Show a notification to facilitators in the "X" cohort (id: 1):
--
-- {
--    isLoggedIn: true,
--    cohort_id: 1,
--    roles: [facilitator]
-- }
--
--
-- Show a notification to visitors only:
--
-- {
--    isLoggedIn: false,
-- }
--
--
-- Show a notification to a specific user (id: 999) when they begin a
-- specific scenario (id: 42) :
--
-- {
--    isLoggedIn: true,
--    user_id: 999,
--    scenario_id: 42
-- }
--
--
--
-- Up above
---
-- Down below

DROP TABLE notification;
