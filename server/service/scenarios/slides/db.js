const { sql, updateQuery } = require('../../../util/sqlHelpers');
const { query } = require('../../../util/db');

exports.getSlidesForScenario = async scenarioId => {
    const results = await query(
        sql` SELECT id, title, components FROM slide WHERE scenario_id = ${scenarioId} ORDER BY "order";`
    );
    return results.rows;
};

exports.addSlide = async ({ scenario_id, title, components, order }) => {
    let q;
    if (!order) {
        q = sql`INSERT INTO slide (scenario_id, title, components) VALUES (${scenario_id}, ${title}, ${components}) RETURNING *;`;
    } else {
        q = sql`INSERT INTO slide (scenario_id, title, components, "order") VALUES (${scenario_id}, ${title}, ${components}, ${order}) RETURNING *;`;
    }
    const results = await query(q);
    return results.rows[0];
};

exports.updateSlide = async (id, data) => {
    const result = await query(updateQuery('slide', { id }, data));
    return result.rows[0];
};

exports.setAllSlides = async (scenario_id, slides) => {
    const results = await query(sql`
INSERT INTO slide (scenario_id, title, components)
    SELECT ${scenario_id} as scenario_id, s.title, s.components FROM
    jsonb_array_elements(${slides}) AS t(slide),
    jsonb_to_record(t.slide) AS s (id int, title text, components jsonb)
    ON CONFLICT DO NOTHING;
    `);
    return { addedCount: results.rowCount };
};

exports.deleteSlide = async ({ scenario_id, id }) => {
    const result = await query(
        sql`DELETE FROM slide WHERE id=${id} and scenario_id=${scenario_id}`
    );
    return result.rowCount;
};

exports.updateSlideOrder = async ({ scenario_id, slide_ids }) => {
    const results = await query(
        sql`
WITH n (slide_id, new_order) as (SELECT jsonb_array_elements_text(${slide_ids}), generate_series(100, 10000000, 10))
UPDATE slide SET "order" = n.new_order
    FROM N
    WHERE scenario_id = ${scenario_id}
        AND id = n.slide_id::int;
`
    );
    return results.rowCount;
};
