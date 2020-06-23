ALTER TABLE cohort_user_role
  DROP CONSTRAINT cohort_user_role_role_check;

ALTER TABLE cohort_user_role
  ADD CONSTRAINT role CHECK (role IN ('owner', 'facilitator', 'researcher', 'participant'));

-- This will update all current cohort "owner" users to be _also_ "facilitator" users
WITH n AS (SELECT cohort_id, user_id FROM cohort_user_role WHERE role = 'owner')
INSERT INTO cohort_user_role (cohort_id, user_id, role)
SELECT cohort_id, user_id, 'facilitator' FROM n
ON CONFLICT DO NOTHING;

-- Up above
---
-- Down below
ALTER TABLE cohort_user_role
  DROP CONSTRAINT cohort_user_role_role_check;

ALTER TABLE cohort_user_role
  ADD CONSTRAINT role CHECK (role IN ('owner', 'facilitator', 'participant'));
