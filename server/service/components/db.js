const { sql } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');

const omitThese = ['ResponseRecall'];

exports.getComponentsByUserId = async user_id => {
  const results = await query(sql`
    SELECT scenario_id, components
    FROM slide
    WHERE scenario_id IN (
      SELECT scenario.id AS scenario_id
      FROM scenario
      JOIN scenario_user_role ON scenario_user_role.scenario_id = scenario.id
      WHERE deleted_at IS NULL
      AND scenario_user_role.user_id = ${user_id}
      AND scenario_user_role.role IN ('owner', 'author')
    )
    AND is_finish IS FALSE
    AND jsonb_array_length( components::jsonb ) != 0
    ORDER BY "order"
  `);

  return results.rows.reduce((accum, { scenario_id, components }) => {
    return accum.concat(
      components.reduce((accum, component) => {
        if (omitThese.includes(component.type)) {
          return accum;
        }
        component.scenario_id = scenario_id;
        return accum.concat([component]);
      }, [])
    );
  }, []);
};

exports.getComponentsByScenarioId = async scenario_id => {
  const results = await query(sql`
    SELECT scenario_id, components
    FROM slide
    WHERE scenario_id = ${scenario_id}
    AND is_finish IS FALSE
    AND jsonb_array_length( components::jsonb ) != 0
    ORDER BY "order"
  `);

  return results.rows.reduce((accum, { scenario_id, components }) => {
    return accum.concat(
      components.reduce((accum, component) => {
        if (omitThese.includes(component.type)) {
          return accum;
        }
        component.scenario_id = scenario_id;
        return accum.concat([component]);
      }, [])
    );
  }, []);
};
