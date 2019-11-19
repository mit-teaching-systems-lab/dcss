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
