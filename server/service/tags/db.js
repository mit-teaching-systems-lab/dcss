const { sql } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');

const TAG_TYPES = {
    CATEGORY = 'category',
    TOPIC = 'topic'
}

const getTagByType = async function(tagType) {
    const result = await query(sql`SELECT t.id, t.name
        FROM tag t
        INNER JOIN
        (
            SELECT * 
            FROM tag_type
            WHERE name='${tagType}'
        ) tt ON t.tag_type_id = tt.id;`);
    return result.rows || [];
};

exports.getCategories = async function(){
    return getTagByType(TAG_TYPES.CATEGORY);
}
