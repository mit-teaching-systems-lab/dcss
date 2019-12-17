const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');

exports.getRunById = async function(id) {
    const result = await query(sql`
        SELECT * FROM run
        WHERE id=${id};
    `);
    return result.rows[0];
};

exports.getUserRuns = async function(user_id) {
    const result = await query(sql`
        SELECT
            run.id as run_id,
            run.created_at as run_created_at,
            run.ended_at as run_ended_at,
            consent_acknowledged_by_user,
            consent_granted_by_user,
            cohort_run.cohort_id as cohort_id,
            scenario.id as scenario_id,
            scenario.title as scenario_title,
            scenario.description as scenario_description,
            scenario.id as scenario_id
        FROM run
        JOIN scenario ON scenario.id = run.scenario_id
        LEFT JOIN cohort_run ON cohort_run.run_id = run.id
        WHERE user_id = ${user_id}
        ORDER BY run.created_at DESC;
    `);
    return result.rows;
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

exports.getRunResponses = async ({ run_id }) => {
    return await withClientTransaction(async client => {
        const result = await client.query(sql`
            SELECT
                run.user_id as user_id,
                username,
                scenario.id as scenario_id,
                scenario.title as scenario_title,
                run.id as run_id,
                run.referrer_params as referrer_params,
                response_id,
                run_response.response,
                run_response.response->>'value' as value,
                audio_transcript.transcript as transcript,
                CASE run_response.response->>'isSkip' WHEN 'false' THEN FALSE
                    ELSE TRUE
                END as is_skip,
                run_response.response->>'type' as type,
                run_response.created_at as created_at,
                run_response.ended_at as ended_at
            FROM run_response
            JOIN run ON run.id = run_response.run_id
            JOIN users ON users.id = run.user_id
            JOIN scenario ON scenario.id = run.scenario_id
            LEFT JOIN audio_transcript ON audio_transcript.key = run_response.response->>'value'
            WHERE run_response.run_id = ${run_id}
            ORDER BY run_response.id ASC
        `);

        return result.rows;
    });
};

exports.getResponses = async ({ run_id, user_id }) => {
    const result = await query(sql`
        SELECT * FROM run_response
        WHERE run_id = ${run_id}
        AND user_id = ${user_id}
        ORDER BY created_at DESC;
    `);
    return result.rows;
};

exports.getAudioTranscript = async ({ run_id, response_id, user_id }) => {
    const result = await query(sql`
        SELECT transcript
        FROM audio_transcript
        JOIN (
            SELECT response->>'value' as audio_key
            FROM run_response
            WHERE response_id = ${response_id}
            AND run_id = ${run_id}
            AND user_id = ${user_id}
            ORDER BY created_at DESC
            LIMIT 1
        ) AS audio_keys ON audio_keys.audio_key = audio_transcript.key
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
