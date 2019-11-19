CREATE TABLE consent (
    id SERIAL PRIMARY KEY,
    prose TEXT NOT NULL CHECK(prose <> ''),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO consent (prose, is_default)
VALUES ('Educators and researchers in the <a href="http://tsl.mit.edu/">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href="https://couhes.mit.edu/">MIT&apos;s IRB review procedures</a>. None of your personal information will be shared.<br><br>More details are available in the consent form itself.', TRUE);

CREATE TABLE scenario_consent (
    scenario_id INT NOT NULL REFERENCES scenario(id),
    consent_id INT NOT NULL REFERENCES consent(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (scenario_id, consent_id)
);

ALTER TABLE run
    ADD COLUMN consent_id INT,
    ADD COLUMN consent_acknowledged_by_user BOOLEAN DEFAULT FALSE,
    ADD COLUMN consent_granted_by_user BOOLEAN DEFAULT FALSE;

UPDATE run SET consent_id = (SELECT id FROM consent WHERE is_default LIMIT 1);

ALTER TABLE run
    ALTER COLUMN consent_id SET NOT NULL,
    ALTER COLUMN consent_id SET DEFAULT 1;

-- Up above
---
-- Down below
ALTER TABLE run DROP COLUMN consent_id;
ALTER TABLE run DROP COLUMN consent_granted_by_user;
ALTER TABLE run DROP COLUMN consent_acknowledged_by_user;
DROP TABLE scenario_consent;
DROP TABLE consent;

