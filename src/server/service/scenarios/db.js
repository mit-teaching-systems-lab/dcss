const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');

exports.getScenario = async function getScenario(scenarioId) {
    const results = await query(
        sql` SELECT * FROM scenario WHERE id = ${scenarioId};`
    );
    return results.rows[0];
};

exports.addScenario = async function addScenario(authorId, title, description) {
    const result = await query(sql`
INSERT INTO scenario (author_id, title, description)
    VALUES (${authorId}, ${title}, ${description})
    RETURNING *;
        `);
    return result.rows[0];
};

exports.setScenario = async function setScenario(scenarioId, scenarioData) {
    const result = await query(
        updateQuery('scenario', { id: scenarioId }, scenarioData)
    );
    return result.rows[0];
};

exports.deleteScenario = async function deleteScenario(scenarioId) {
    const result = await query(
        sql`DELETE FROM scenario WHERE id = ${scenarioId};`
    );
    return { deletedCount: result.rowCount };
};
