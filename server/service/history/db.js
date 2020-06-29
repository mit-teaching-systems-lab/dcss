const { sql } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');
const { getScenarioSlides } = require('./slides/db');
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

async function getHistoryForScenario(params) {
  const {
    // TODO: implement support for limiting by cohort
    cohort_id,
    scenario_id
  } = params;
  let results;

  if (cohort_id) {
    results = await query(sql`
      SELECT run_id
      FROM cohort_run
      JOIN run ON run.id = cohort_run.run_id
      WHERE run.consent_granted_by_user = true
      AND run.scenario_id = ${scenario_id};
    `);
  } else {
    results = await query(sql`
      SELECT id AS run_id
      FROM run
      WHERE consent_granted_by_user = true
      AND scenario_id = ${scenario_id};
    `);
  }

  const prompts = await getScenarioPrompts(scenario_id);
  const responses = [];

  for (const { run_id } of results.rows) {
    responses.push(await getRunResponses({ run_id }));
  }

  return { prompts, responses };
}

exports.getHistoryForScenario = getHistoryForScenario;
