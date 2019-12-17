const { sql } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');

exports.createCohort = async ({ name, user_id }) => {
    if (!(name && user_id)) {
        throw new Error(
            'Creating cohort requires user id and a name to be provided'
        );
    }

    return await withClientTransaction(async client => {
        // create a cohort
        const create = await client.query(
            sql`INSERT INTO cohort (name) VALUES (${name}) RETURNING *`
        );
        const cohort = create.rows[0];
        // assign user as owner
        await client.query(
            sql`INSERT INTO cohort_user_role (cohort_id, user_id, role)
            VALUES (${cohort.id}, ${user_id}, 'owner')`
        );
        return cohort;
    });
};

async function getCohortScenarios(cohort_id) {
    return await withClientTransaction(async client => {
        const result = await client.query(sql`
            SELECT scenario.id as id
            FROM scenario
            INNER JOIN cohort_scenario
                ON scenario.id = cohort_scenario.scenario_id
            WHERE cohort_scenario.cohort_id = ${cohort_id}
              AND scenario.deleted_at IS NULL;
        `);
        return result.rows.map(row => row.id);
    });
}

async function getCohortRuns(cohort_id) {
    return await withClientTransaction(async client => {
        const result = await client.query(sql`
            SELECT *
            FROM run
            INNER JOIN cohort_run
                ON run.id = cohort_run.run_id
            WHERE cohort_run.cohort_id = ${cohort_id};
        `);

        return result.rows;
    });
}

async function getCohortUsers(cohort_id) {
    return await withClientTransaction(async client => {
        const result = await client.query(sql`
            SELECT *
            FROM users
            INNER JOIN cohort_user_role
                ON users.id = cohort_user_role.user_id
            WHERE cohort_user_role.cohort_id = ${cohort_id};
        `);

        return result.rows;
    });
}

exports.getCohort = async ({ id }) => {
    return await withClientTransaction(async client => {
        const result = await client.query(sql`
            SELECT cohort.id, cohort.name, cohort.created_at, cohort_user_role.role
            FROM cohort
            LEFT JOIN cohort_user_role
                ON cohort_user_role.cohort_id = cohort.id
            WHERE cohort.id = ${id}
        `);

        const runs = await getCohortRuns(id);
        const scenarios = await getCohortScenarios(id);
        const users = await getCohortUsers(id);

        return {
            ...result.rows[0],
            runs,
            scenarios,
            users
        };
    });
};

exports.getMyCohorts = async ({ user_id }) => {
    return await withClientTransaction(async client => {
        const result = await client.query(sql`
            SELECT cohort.id, cohort.name, cohort.created_at, cohort_user_role.role
            FROM cohort
            LEFT JOIN cohort_user_role
                ON cohort.id = cohort_user_role.cohort_id
            WHERE cohort_user_role.user_id = ${user_id};
        `);

        const cohorts = [];
        for (const row of result.rows) {
            const runs = await getCohortRuns(row.id);
            const scenarios = await getCohortScenarios(row.id);
            const users = await getCohortUsers(row.id);
            cohorts.push({
                ...row,
                runs,
                scenarios,
                users
            });
        }
        return cohorts;
    });
};

exports.getAllCohorts = async () => {
    return await withClientTransaction(async client => {
        const result = await client.query(sql`
            SELECT * FROM cohort;
        `);

        const cohorts = [];
        for (const row of result.rows) {
            const runs = await getCohortRuns(row.id);
            const scenarios = await getCohortScenarios(row.id);
            const users = await getCohortUsers(row.id);
            cohorts.push({
                ...row,
                runs,
                scenarios,
                users
            });
        }
        return cohorts;
    });
};

exports.setCohort = async () => {
    // console.log('setCohort', params);

    return {};
    // return await withClientTransaction(async client => {
    //     const result = await client.query(sql`
    //         SELECT * FROM cohort WHERE id = ${cohort_id}
    //     `);
    //     return result.rows[0];
    // });
};

exports.setCohortScenarios = async ({ id, scenarios }) => {
    return await withClientTransaction(async client => {
        await client.query(sql`
            DELETE FROM cohort_scenario
            WHERE cohort_id = ${Number(id)};
        `);

        for (const scenario_id of scenarios) {
            await client.query(sql`
                INSERT INTO cohort_scenario (cohort_id, scenario_id)
                VALUES (${Number(id)}, ${Number(scenario_id)});
            `);
        }
        return scenarios;
    });
};

exports.getCohortRunResponses = async ({ id, scenario_id, participant_id }) => {
    return await withClientTransaction(async client => {
        let responses = [];
        if (participant_id) {
            const result = await client.query(sql`
                SELECT
                    run.user_id as user_id,
                    username,
                    scenario.id as scenario_id,
                    scenario.title as scenario_title,
                    cohort_run.run_id as run_id,
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
                JOIN cohort_run ON run_response.run_id = cohort_run.run_id
                JOIN run ON run.id = cohort_run.run_id
                JOIN users ON users.id = run.user_id
                JOIN scenario ON scenario.id = run.scenario_id
                LEFT JOIN audio_transcript ON audio_transcript.key = run_response.response->>'value'
                WHERE cohort_run.cohort_id = ${id}
                AND run.user_id = ${participant_id}
                ORDER BY cohort_run.run_id DESC
            `);

            responses.push(...result.rows);
        } else {
            const result = await client.query(sql`
                SELECT
                    run.user_id as user_id,
                    username,
                    scenario.id as scenario_id,
                    scenario.title as scenario_title,
                    cohort_run.run_id as run_id,
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
                JOIN cohort_run ON run_response.run_id = cohort_run.run_id
                JOIN run ON run.id = cohort_run.run_id
                JOIN users ON users.id = run.user_id
                JOIN scenario ON scenario.id = run.scenario_id
                LEFT JOIN audio_transcript ON audio_transcript.key = run_response.response->>'value'
                WHERE cohort_run.cohort_id = ${id}
                AND run.scenario_id = ${scenario_id}
                ORDER BY cohort_run.run_id DESC
            `);

            responses.push(...result.rows);
        }

        return responses;
    });
};

exports.linkCohortToRun = async ({ id, run_id }) => {
    if (!(id && run_id)) {
        throw new Error(
            'Link a cohort to a run requires a cohort id, run id and user id'
        );
    }

    return await withClientTransaction(async client => {
        const result = await client.query(sql`
            INSERT INTO cohort_run (cohort_id, run_id)
            VALUES (${id}, ${run_id})
            ON CONFLICT DO NOTHING;
        `);

        return result;
    });
};

exports.setCohortUserRole = async ({ cohort_id, user_id, role, action }) => {
    if (!(cohort_id && user_id)) {
        throw new Error(
            'Setting a cohort user role requires a cohort id and a user_id'
        );
    }

    return await withClientTransaction(async client => {
        let result;
        if (action === 'join') {
            result = await client.query(sql`
                INSERT INTO cohort_user_role (cohort_id, user_id, role)
                VALUES (${cohort_id}, ${user_id}, ${role})
                RETURNING *;
            `);
        }

        if (action === 'done') {
            const ended_at = new Date().toISOString();
            result = await client.query(sql`
                UPDATE cohort_user_role
                SET ended_at = ${ended_at}
                WHERE cohort_id = ${cohort_id} AND user_id = ${user_id}
                RETURNING *;
            `);
        }

        if (action === 'quit') {
            result = await client.query(sql`
                DELETE FROM cohort_user_role
                WHERE cohort_id = ${cohort_id} AND user_id = ${user_id}
                RETURNING *;
            `);
        }

        return result && result.rows.length && getCohortUsers(cohort_id);
    });
};

exports.listUserCohorts = async ({ user_id }) => {
    const result = await query(
        sql`SELECT cohort.id, cohort.name, cohort_user_role.role
            FROM cohort
            LEFT JOIN cohort_user_role
                ON cohort_user_role.cohort_id = cohort.id
            WHERE cohort_user_role.user_id = ${user_id}`
    );
    return result.rows;
};
