const { sql } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');

exports.getCategories = async function() {
    const result = await query(sql`SELECT t.id, t.name
        FROM tag t
        INNER JOIN
        (
            SELECT * 
            FROM tag_type
            WHERE name='category'
        ) tt ON t.tag_type_id = tt.id;`);
    return result.rows;
};
