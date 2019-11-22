const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');

exports.getRunById = async function(id) {
    const result = await query(sql`
        SELECT * FROM run
        WHERE id=${id};
    `);
    return result.rows[0];
};

exports.fetchRun = async function({ scenario_id, user_id }) {
    const result = await query(sql`
        SELECT * FROM run
        WHERE scenario_id=${scenario_id}
        AND user_id=${user_id}
        AND ended_at IS NULL;
    `);
    return result.rows[0];
};

exports.createRun = async function({ scenario_id, user_id, consent_id }) {
    const result = await query(sql`
        INSERT INTO run (scenario_id, user_id, consent_id)
        VALUES (${scenario_id}, ${user_id}, ${consent_id})
        RETURNING *;
    `);
    return result.rows[0];
};

exports.updateRun = async function(id, data) {
    const result = await query(updateQuery('run', { id }, data));
    return result.rows[0];
};

exports.upsertResponse = async ({
    run_id,
    response_id,
    response,
    user_id,
    created_at,
    ended_at
}) => {
    const result = await query(sql`
        INSERT INTO run_response (run_id, response_id, response, user_id, created_at, ended_at)
        VALUES (${run_id}, ${response_id}, ${response}, ${user_id}, ${created_at}, ${ended_at});
    `);
    return result.rows[0];
};

exports.getResponse = async ({ run_id, response_id, user_id }) => {
    const result = await query(sql`
        SELECT * FROM run_response
        WHERE response_id = ${response_id}
        AND run_id = ${run_id}
        AND user_id = ${user_id}
        ORDER BY created_at DESC
        LIMIT 1;
    `);
    return result.rows[0];
};

exports.finishRun = async function(id) {
    const result = await query(sql`
        UPDATE run
        SET ended_at = CURRENT_TIMESTAMP
        WHERE id=${id}
        RETURNING *;
    `);
    return result.rows[0];
};
