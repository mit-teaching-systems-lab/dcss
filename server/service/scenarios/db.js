const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');
const slidesdb = require('./slides/db');

async function getScenarioCategories(scenarioId) {
    const scenarioCategoriesResults = await query(sql`
        SELECT c.name as name
        FROM scenario_tag s
        INNER JOIN categories c
        ON s.tag_id = c.id
        where scenario_id = ${scenarioId};
    `);

    return scenarioCategoriesResults.rows.map(r => r.name);
}

async function addConsent(consent) {
    const result = await query(sql`
        INSERT INTO consent (prose)
        VALUES (${consent.prose})
        RETURNING *;
    `);

    return result.rowCount && result.rows[0];
}

async function setScenarioConsent(scenarioId, consent) {
    const result = await query(sql`
        INSERT INTO scenario_consent (scenario_id, consent_id)
        VALUES (${scenarioId}, ${consent.id})
        RETURNING *;
    `);

    return result.rowCount && result.rows[0];
}

async function getScenarioConsent(scenarioId) {
    let results = await query(sql`
        SELECT c.id as id, c.prose as prose
        FROM scenario_consent s
        INNER JOIN consent c
        ON s.consent_id = c.id
        WHERE s.scenario_id = ${scenarioId}
        ORDER BY s.created_at DESC
        LIMIT 1;
    `);

    if (!results.rowCount) {
        results = await query(sql`
            INSERT INTO scenario_consent (scenario_id, consent_id)
            SELECT ${scenarioId}, id FROM consent WHERE is_default LIMIT 1
            RETURNING *;
        `);
    }

    return results.rows[0] || { id: null, prose: '' };
}

async function getScenario(scenarioId) {
    const results = await query(sql`
        SELECT * FROM scenario WHERE id = ${scenarioId};
    `);

    const categories = await getScenarioCategories(scenarioId);
    const consent = await getScenarioConsent(scenarioId);
    const finish = (await slidesdb.getSlidesForScenario(scenarioId)).find(
        slide => slide.is_finish
    );

    return {
        ...results.rows[0],
        categories,
        consent,
        finish
    };
}

async function getAllScenarios() {
    const results = await query(sql`
        SELECT * FROM scenario ORDER BY created_at DESC;
    `);

    const scenarios = [];
    for (const row of results.rows) {
        const categories = await getScenarioCategories(row.id);
        const consent = await getScenarioConsent(row.id);
        scenarios.push({ ...row, categories, consent });
    }

    return scenarios;
}

async function addScenario(authorId, title, description) {
    const scenarioInsert = await query(sql`
        INSERT INTO scenario (author_id, title, description)
            VALUES (${authorId}, ${title}, ${description})
            RETURNING *;
    `);

    const consentSelect = await query(sql`
        SELECT id FROM consent WHERE is_default
    `);
    const consentDefault = consentSelect.rows[0];
    const scenario = scenarioInsert.rows[0];
    const consent = await setScenarioConsent(scenario.id, consentDefault);

    // Create the default finish slide
    const finish = await slidesdb.addSlide({
        scenario_id: scenario.id,
        title: scenario.title,
        is_finish: true,
        components:
            '[{"html": "<h2>Thanks for participating!</h2>","type": "Text"}]'
    });

    return {
        ...scenario,
        consent,
        finish
    };
}

async function setScenario(scenarioId, scenario) {
    const result = await query(
        updateQuery('scenario', { id: scenarioId }, scenario)
    );
    return result.rows[0];
}

async function addScenarioCategory(scenarioId, category) {
    const insertedRow = await query(sql`
        WITH t AS (SELECT id as tag_id FROM tag WHERE name=${category})
        INSERT INTO scenario_tag (scenario_id, tag_id)
        SELECT CAST(${scenarioId} as INTEGER) as scenario_id, tag_id from t;
    `);

    return insertedRow;
}

async function deleteScenarioCategory(scenarioId, category) {
    const deletedRow = await query(sql`
        DELETE
        FROM scenario_tag s
        USING categories c
        WHERE
            s.tag_id = c.id AND
            s.scenario_id=${scenarioId} AND
            c.name=${category};
    `);

    return deletedRow;
}

async function setScenarioCategories(scenarioId, categories) {
    const currentCategoriesResults = await query(sql`
        SELECT s.scenario_id, c.name as category
        FROM scenario_tag s
        INNER JOIN categories c on s.tag_id = c.id
        WHERE scenario_id=${scenarioId};
    `);

    // This is the list of categories that already exist in current categories
    const currentCategories = currentCategoriesResults.rows.map(
        r => r.category
    );

    // We want to get the diff of currentCategories and categoriesChecked
    //     to delete the current categories that are left over
    const categoriesChecked = [];
    let promises = [];

    for (let category of categories) {
        if (
            currentCategories.length > 0 &&
            currentCategories.includes(category)
        ) {
            categoriesChecked.push(category);
        } else {
            promises.push(addScenarioCategory(scenarioId, category));
        }
    }

    // This filter will return all the categories that need to be deleted
    const toDelete = currentCategories.filter(
        c => categoriesChecked.indexOf(c) < 0
    );

    for (let category of toDelete) {
        promises.push(deleteScenarioCategory(scenarioId, category));
    }

    return Promise.all(promises);
}

async function deleteScenario(scenarioId) {
    let result;

    result = await query(sql`
        DELETE FROM scenario_consent WHERE scenario_id = ${scenarioId};
    `);

    result = await query(sql`
        DELETE FROM scenario_tag WHERE scenario_id = ${scenarioId};
    `);

    // TODO: need to handle the previous result

    result = await query(sql`
        DELETE FROM slide WHERE scenario_id = ${scenarioId};
    `);

    // TODO: need to handle the previous result

    result = await query(sql`
        DELETE FROM scenario WHERE id = ${scenarioId};
    `);

    return { deletedCount: result.rowCount };
}

async function softDeleteScenario(scenarioId) {
    const result = await query(sql`
        UPDATE scenario
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id=${scenarioId}
        RETURNING *;
    `);
    return result.rows[0];
}

async function getScenarioResearchData(scenarioId) {
    const result = await query(sql`
        SELECT run_response.*
        FROM run
        INNER JOIN run_response on run.id = run_response.run_id
        WHERE run.consent_granted_by_user = true
        AND run.scenario_id = ${scenarioId};
    `);

    return result.rows;
}

async function getScenarioByRun(userId) {
    const result = await query(sql`
        SELECT DISTINCT * FROM scenario
        WHERE id IN
        (
            SELECT scenario_id
            FROM run
            WHERE user_id = ${userId}
        );
    `);

    return result.rows;
}

// Scenario
exports.addScenario = addScenario;
exports.setScenario = setScenario;
exports.getScenario = getScenario;
exports.deleteScenario = deleteScenario;
exports.softDeleteScenario = softDeleteScenario;
exports.getAllScenarios = getAllScenarios;
exports.getScenarioResearchData = getScenarioResearchData;
exports.getScenarioByRun = getScenarioByRun;

// Scenario Consent
exports.addConsent = addConsent;
exports.setScenarioConsent = setScenarioConsent;
exports.getScenarioConsent = getScenarioConsent;

// Scenario Categories
exports.setScenarioCategories = setScenarioCategories;
