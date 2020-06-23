ALTER TABLE cohort_user_role
  DROP CONSTRAINT cohort_user_role_pkey,
  ADD PRIMARY KEY(cohort_id, user_id, role);
-- Up above
---
-- Down below
ALTER TABLE cohort_user_role
  DROP CONSTRAINT cohort_user_role_pkey,
  ADD PRIMARY KEY(cohort_id, user_id);
