const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');

const TYPES = {
  CATEGORY: 'categories',
  TOPIC: 'topics',
  LABEL: 'labels'
};

const TYPE_ID_FOR = {
  CATEGORY: 1,
  TOPIC: 2,
  LABEL: 3
};

async function getTags() {
  const result = await query(sql`
    SELECT * FROM tag
  `);
  return result.rows || [];
}

async function getTagByType(tagType) {
  // DO NOT USE THE sql`` helper here
  const result = await query(`
    SELECT t.id, t.name
    FROM tag t
    INNER JOIN ${tagType} tt ON t.tag_type_id = tt.id
    ORDER BY id ASC;
  `);
  return result.rows || [];
}

async function getCategories() {
  return getTagByType(TYPES.CATEGORY);
}

async function getTopics() {
  return getTagByType(TYPES.TOPIC);
}

async function getLabels() {
  return getTagByType(TYPES.LABEL);
}

async function getLabelsByOccurrence(direction = 'DESC') {
  const result = await query(`
    SELECT tag.id, tag.name, n.count
    FROM tag
    INNER JOIN labels ON tag.tag_type_id = labels.id
    INNER JOIN (
      SELECT tag_id, COUNT (tag_id) as count
      FROM scenario_tag
      GROUP BY tag_id
    ) n ON tag.id = n.tag_id
    ORDER BY n.count ${direction}
  `);
  return result.rows || [];
}

async function createTag(name, tag_type_id) {
  return await withClientTransaction(async client => {
    const exists = await client.query(sql`
      SELECT *
      FROM tag
      WHERE name = ${name}
    `);

    if (exists.rowCount) {
      return exists.rows[0];
    }

    const result = await client.query(sql`
      INSERT INTO tag (name, tag_type_id)
      VALUES (${name}, ${tag_type_id})
      RETURNING *;
    `);

    return result.rowCount ? result.rows[0] : null;
  });
}

exports.TYPE_ID_FOR = TYPE_ID_FOR;
exports.createTag = createTag;
exports.getCategories = getCategories;
exports.getTopics = getTopics;
exports.getLabels = getLabels;
exports.getLabelsByOccurrence = getLabelsByOccurrence;
exports.getTags = getTags;
