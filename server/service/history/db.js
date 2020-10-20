const { sql } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');
const { getScenarioSlides } = require('../scenarios/slides/db');
const { getRunResponses } = require('../runs/db');

async function getScenarioPrompts(scenario_id) {
  const slides = await getScenarioSlides(scenario_id);
  const components = slides.reduce((accum, slide) => {
    if (slide.components && slide.components.length) {
      accum.push(
        ...slide.components.reduce((accum, component) => {
          if (component.responseId) {
            accum.push({
              slide,
              ...component
            });
          }
          return accum;
        }, [])
      );
    }
    return accum;
  }, []);

  return components;
}

async function getHistoryForScenario(request) {
  const {
    // TODO: implement support for limiting by cohort
    cohort_id,
    scenario_id
  } = request.params;
  const { is_super } = request.session.user;

  let select;

  if (cohort_id) {
    select = `
      SELECT
        run.user_id as user_id,
        username,
        run.id as run_id,
        run.referrer_params as referrer_params,
        response_id,
        run_response.response,
        run_response.response->>'value' as value,
        run_response.response->>'content' as content,
        audio_transcripts.transcript as transcript,
        CASE run_response.response->>'isSkip' WHEN 'false' THEN FALSE
            ELSE TRUE
        END as is_skip,
        run_response.response->>'type' as type,
        run_response.created_at as created_at,
        run_response.ended_at as ended_at,
        run.consent_granted_by_user,
        cohort_run.cohort_id
      FROM run_response
      JOIN run ON run.id = run_response.run_id
      JOIN cohort_run ON cohort_run.run_id = run_response.run_id
      JOIN users ON users.id = run.user_id
      LEFT JOIN audio_transcripts ON audio_transcripts.key = run_response.response->>'value'
      WHERE run.scenario_id = ${scenario_id}
      AND cohort_run.cohort_id = ${cohort_id}
      ${!is_super ? 'AND consent_granted_by_user = true' : ''}
      ORDER BY run_response.id ASC
    `;
  } else {
    select = `
      SELECT
        run.user_id as user_id,
        username,
        run.id as run_id,
        run.referrer_params as referrer_params,
        response_id,
        run_response.response,
        run_response.response->>'value' as value,
        run_response.response->>'content' as content,
        audio_transcripts.transcript as transcript,
        CASE run_response.response->>'isSkip' WHEN 'false' THEN FALSE
            ELSE TRUE
        END as is_skip,
        run_response.response->>'type' as type,
        run_response.created_at as created_at,
        run_response.ended_at as ended_at,
        run.consent_granted_by_user,
        cohort_run.cohort_id
      FROM run_response
      JOIN run ON run.id = run_response.run_id
      JOIN users ON users.id = run.user_id
      LEFT JOIN cohort_run ON cohort_run.run_id = run_response.run_id
      LEFT JOIN audio_transcripts ON audio_transcripts.key = run_response.response->>'value'
      WHERE run.scenario_id = ${scenario_id}
      ${!is_super ? 'AND consent_granted_by_user = true' : ''}
      ORDER BY run_response.id ASC
    `;
  }
  const prompts = await getScenarioPrompts(scenario_id);
  const {rows: [scenario]} = await query(`
    SELECT
      title as scenario_title
    FROM scenario
    WHERE id = ${scenario_id}
  `);
  const result = await query(select);
  const responses = result.rows.map(row => {
    return {
      scenario_id,
      ...scenario,
      ...row,
    };
  });
  console.log(responses);

  return { prompts, responses };
}

exports.getHistoryForScenario = getHistoryForScenario;
