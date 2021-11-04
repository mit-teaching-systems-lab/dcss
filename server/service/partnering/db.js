const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');

async function getPartnering() {
  const result = await query(sql`
    SELECT * FROM partnering
  `);
  return result.rows || [];
}

exports.getPartnering = getPartnering;
