CREATE OR REPLACE VIEW run_response_view AS
  SELECT
    run_response.id as id,
    run.id as run_id,
    run.user_id as user_id,
    cohort_run.cohort_id,
    run.scenario_id as scenario_id,
    run_response.response_id,
    run_response.response->>'value' as value,
    run_response.response->>'content' as content,
    audio_transcripts.transcript as transcript,
    CASE run_response.response->>'isSkip' WHEN 'false' THEN FALSE
        ELSE TRUE
    END as is_skip,
    run_response.response->>'type' as type,
    run_response.created_at as created_at,
    run_response.ended_at as ended_at,
    run.consent_granted_by_user
  FROM run_response
  JOIN run ON run.id = run_response.run_id
  JOIN users ON users.id = run.user_id
  LEFT JOIN cohort_run ON cohort_run.run_id = run_response.run_id
  LEFT JOIN audio_transcripts ON audio_transcripts.key = run_response.response->>'value'
  ORDER BY run_response.id ASC

-- Up above
---
-- Down below

DROP VIEW run_response_view;
