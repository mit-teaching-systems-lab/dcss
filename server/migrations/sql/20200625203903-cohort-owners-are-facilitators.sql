WITH n AS (SELECT cohort_id, user_id FROM cohort_user_role WHERE role = 'owner')
INSERT INTO cohort_user_role (cohort_id, user_id, role)
SELECT cohort_id, user_id, 'facilitator' FROM n
ON CONFLICT DO NOTHING;
-- Up above
---
-- Down below
