DROP TABLE cohort_scenario;
-- "Assigned" scenarios for a cohort
CREATE TABLE cohort_scenario (
    id SERIAL PRIMARY KEY,
    cohort_id INT REFERENCES cohort(id),
    scenario_id INT REFERENCES scenario(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Up above
---
-- Down below

DROP TABLE cohort_scenario;
-- "Assigned" scenarios for a cohort
CREATE TABLE cohort_scenario (
    cohort_id INT REFERENCES cohort(id),
    scenario_id INT REFERENCES scenario(id),
    PRIMARY KEY (cohort_id, scenario_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

