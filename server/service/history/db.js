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

  let superSelect;
  let regularSelect;

  if (cohort_id) {
    superSelect = sql`
      SELECT run_id, consent_granted_by_user
      FROM cohort_run
      JOIN run ON run.id = cohort_run.run_id
      WHERE run.scenario_id = ${scenario_id};
    `;

    regularSelect = sql`
      SELECT run_id, consent_granted_by_user
      FROM cohort_run
      JOIN run ON run.id = cohort_run.run_id
      WHERE run.consent_granted_by_user = true
      AND run.scenario_id = ${scenario_id};
    `;
  } else {
    superSelect = sql`
      SELECT id AS run_id, consent_granted_by_user
      FROM run
      WHERE scenario_id = ${scenario_id};
    `;

    regularSelect = sql`
      SELECT id AS run_id, consent_granted_by_user
      FROM run
      WHERE consent_granted_by_user = true
      AND scenario_id = ${scenario_id};
    `;
  }
  const select = is_super ? superSelect : regularSelect;

  const results = await query(select);
  const prompts = await getScenarioPrompts(scenario_id);
  const responses = [];

  for (const { run_id } of results.rows) {
    responses.push(await getRunResponses({ run_id }));
  }

  return { prompts, responses };
}

exports.getHistoryForScenario = getHistoryForScenario;
