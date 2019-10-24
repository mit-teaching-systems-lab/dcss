const { sql } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');

exports.getRunById = async function(id) {
    const result = await query(sql`SELECT * FROM run WHERE id=${id}`);
    return result.rows[0];
};

exports.createRun = async function({ scenario_id, user_id }) {
    const result = await query(
        sql`INSERT INTO run (scenario_id, user_id) VALUES (${scenario_id}, ${user_id}) RETURNING *`
    );
    return result.rows[0];
};

exports.upsertResponse = async ({ run_id, response_id, response }) => {
    const result = await query(
        sql`
        INSERT INTO run_response (run_id, response_id, response) 
           VALUES (${run_id}, ${response_id}, ${response})
        ON CONFLICT (run_id, response_id) DO UPDATE SET response = EXCLUDED.response RETURNING *;
        `
    );
    return result.rows[0];
};

exports.finishRun = async function(id) {
    const result = await query(
        sql`UPDATE run SET ended_at = CURRENT_TIMESTAMP WHERE id=${id} RETURNING *`
    );
    return result.rows[0];
};
