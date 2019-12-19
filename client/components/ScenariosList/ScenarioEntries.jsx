import React from 'react';
import PropTypes from 'prop-types';

import ScenarioCard from './ScenarioCard';

/* eslint-disable */
const SCENARIO_STATUS_DRAFT = 1;
const SCENARIO_STATUS_PUBLIC = 2;
const SCENARIO_STATUS_PRIVATE = 3;
/* eslint-enable */

const ScenarioEntries = ({ scenarios, isLoggedIn }) => {
    if (!scenarios.length) return null;

    return scenarios.reduce((accum, scenario) => {
        const { status, user_is_author: isAuthor } = scenario;

        // This scenario status is "draft", to see it:
        //  - user must be logged in
        //  - user must be the author
        if (status === SCENARIO_STATUS_DRAFT && (!isLoggedIn || !isAuthor)) {
            return accum;
        }
        // This scenario status is "private", to see it:
        //  - user must be logged in
        if (status === SCENARIO_STATUS_PRIVATE && !isLoggedIn) {
            return accum;
        }
        accum.push(
            <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                isLoggedIn={isLoggedIn}
            />
        );

        return accum;
    }, []);
};

ScenarioCard.propTypes = {
    scenarios: PropTypes.array,
    isLoggedIn: PropTypes.bool.isRequired
};

export default ScenarioEntries;
