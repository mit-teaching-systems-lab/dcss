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

exports.getCohorts = async ({ user_id }) => {
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
