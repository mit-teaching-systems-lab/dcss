CREATE TABLE cohort (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Track the owner, facilitators, and participants via a role table specific to cohorts
CREATE TABLE cohort_user_role (
    cohort_id INT REFERENCES cohort(id),
    user_id INT REFERENCES users(id),
    PRIMARY KEY (cohort_id, user_id),
    role VARCHAR NOT NULL CHECK (role IN ('owner', 'facilitator', 'participant')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- "Assigned" scenarios for a cohort
CREATE TABLE cohort_scenario (
    cohort_id INT REFERENCES cohort(id),
    scenario_id INT REFERENCES scenario(id),
    PRIMARY KEY (cohort_id, scenario_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Starting a run from the cohort page will add it to the index of runs for the cohort here
CREATE TABLE cohort_run (
    cohort_id INT REFERENCES cohort(id),
    run_id INT REFERENCES run(id),
    PRIMARY KEY (cohort_id, run_id)
);

-- Invite links
CREATE TABLE cohort_invite (
    id SERIAL PRIMARY KEY,
    cohort_id INT REFERENCES cohort(id),
    linkcode VARCHAR(16) UNIQUE, -- The part of the invite URL that was generated for this link
    role VARCHAR NOT NULL CHECK (role IN ('facilitator', 'participant')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    -- NULL means it is not a limited use invite link
    uses_left INT,
    last_used TIMESTAMPTZ
);


-- Up above
---
-- Down below

DROP TABLE cohort_invite;
DROP TABLE cohort_run;
DROP TABLE cohort_scenario;
DROP TABLE cohort_user_role;
DROP TABLE cohort;