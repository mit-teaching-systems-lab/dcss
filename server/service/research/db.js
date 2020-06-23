const { sql } = require('../../util/sqlHelpers');
const {
  withClient
  // withClientTransaction
} = require('../../util/db');

exports.getAllCohortGrants = async function({ user }) {
  return withClient(async client => {
    const result = await client.query(sql`
      SELECT *
      FROM cohort
      INNER JOIN cohort_user_role
      ON cohort.id = cohort_user_role.cohort_id
      WHERE cohort_user_role.user_id = ${user.id};
    `);
    return result.rows;
  });
};
