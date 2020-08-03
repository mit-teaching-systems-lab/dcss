const { sql, updateQuery } = require('../../util/sqlHelpers');
const { withClient, withClientTransaction } = require('../../util/db');

exports.addCapturedRequestAndResponse = async capture => {
  return await withClientTransaction(async client => {
    await client.query(sql`
      INSERT INTO log (capture)
      VALUES (${capture})
      ON CONFLICT DO NOTHING;
    `);
  });
};
