const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');

async function getTraces() {
  const result = await query(sql`
    SELECT
      run_event.id AS id,
      run.id AS run_id,
      run.user_id,
      run.scenario_id,
      name,
      context
    FROM run_event
    JOIN run ON run.id = run_event.run_id
    JOIN users ON users.id = run.user_id
    JOIN scenario ON scenario.id = run.scenario_id
    ORDER BY run.ended_at DESC
  `);
  return result.rows;
}

async function getTracesByScenarioId(scenario_id) {
  const result = await query(sql`
    SELECT
      run_event.id AS id,
      run.id AS run_id,
      run.user_id,
      run.scenario_id,
      name,
      context
    FROM run_event
    JOIN run ON run.id = run_event.run_id
    JOIN users ON users.id = run.user_id
    JOIN scenario ON scenario.id = run.scenario_id
    WHERE scenario.id = ${scenario_id}
    ORDER BY run.ended_at DESC
  `);
  return result.rows;
}

async function getTracesByCohortId(cohort_id) {
  const result = await query(sql`
    SELECT
      run_event.id AS id,
      run.id AS run_id,
      run.user_id,
      run.scenario_id,
      name,
      context
    FROM run_event
    JOIN run ON run.id = run_event.run_id
    JOIN cohort_run ON cohort_run.run_id = run_event.run_id
    JOIN users ON users.id = run.user_id
    JOIN scenario ON scenario.id = run.scenario_id
    WHERE cohort_run.cohort_id = ${cohort_id}
    ORDER BY run.ended_at DESC;
  `);
  return result.rows;
}

async function getTracesByCohortIdAndScenarioId(cohort_id, scenario_id) {
  const result = await getTracesByCohortId(cohort_id);
  return result.rows.filter(row => row.scenario_id === scenario_id);
}

async function getTracesByRunId(run_id) {
  const result = await query(sql`
    SELECT
      run_event.id AS id,
      run.id AS run_id,
      run.user_id,
      run.scenario_id,
      name,
      context
    FROM run_event
    JOIN run ON run.id = run_event.run_id
    JOIN users ON users.id = run.user_id
    JOIN scenario ON scenario.id = run.scenario_id
    WHERE run.id = ${run_id}
    ORDER BY run.ended_at DESC;
  `);
  return result.rows;
}

async function getTracesByUserId(user_id) {
  const result = await query(sql`
    SELECT
      run_event.id AS id,
      run.id AS run_id,
      run.user_id,
      run.scenario_id,
      name,
      context
    FROM run_event
    JOIN run ON run.id = run_event.run_id
    JOIN users ON users.id = run.user_id
    JOIN scenario ON scenario.id = run.scenario_id
    WHERE users.id = ${user_id}
    ORDER BY run.ended_at DESC;
  `);
  return result.rows;
}

exports.getTraces = getTraces;
exports.getTracesByCohortId = getTracesByCohortId;
exports.getTracesByCohortIdAndScenarioId = getTracesByCohortIdAndScenarioId;
exports.getTracesByRunId = getTracesByRunId;
exports.getTracesByScenarioId = getTracesByScenarioId;
exports.getTracesByUserId = getTracesByUserId;
