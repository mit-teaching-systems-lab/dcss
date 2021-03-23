CREATE OR REPLACE FUNCTION get_first_super_admin() RETURNS integer AS $$
  BEGIN
    RETURN (
      SELECT id FROM user_role_detail WHERE 'super_admin' = any (roles) ORDER BY id ASC LIMIT 1
    );
  END;
$$ LANGUAGE plpgsql;


DO $$
BEGIN
  IF (SELECT get_first_super_admin()) IS NULL THEN
    INSERT
      INTO users
        (username, email)
      VALUES
        ('', '')
      ;

    INSERT
      INTO user_role
        (user_id, role)
      VALUES
        ((SELECT id FROM users ORDER BY id DESC), 'super_admin')
      ;
  END IF;
END $$;

DELETE FROM persona;

INSERT INTO persona (id, name, description, color, author_id, is_read_only, is_shared)
VALUES
  (1, 'Participant', 'The default user participating in a single person scenario.', '#FFFFFF', (SELECT get_first_super_admin()), TRUE, TRUE),
  (2, 'Teacher', 'A non-specific teacher, participating in a multi person scenario.', '#3f59a9', (SELECT get_first_super_admin()), TRUE, TRUE),
  (3, 'Student', 'A non-specific student, participating in a multi person scenario.', '#e59235', (SELECT get_first_super_admin()), TRUE, TRUE),
  (4, 'Facilitator', 'A non-specific facilitator, leading participation in a multi person scenario.', '#73b580', (SELECT get_first_super_admin()), TRUE, TRUE)
;


-- Up above
---
-- Down below

DROP FUNCTION get_first_super_admin();
DELETE FROM scenario_persona WHERE persona_id IN (1, 2, 3, 4);
DELETE FROM persona WHERE id IN (1, 2, 3, 4);

