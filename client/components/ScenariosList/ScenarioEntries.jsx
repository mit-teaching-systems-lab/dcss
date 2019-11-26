import React from 'react';
import PropTypes from 'prop-types';

import ScenarioCard from './ScenarioCard';

const ScenarioEntries = ({ scenarios, isLoggedIn }) => {
    if (!scenarios.length) return null;

    return scenarios.map(scenario => {
        return (
            <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                isLoggedIn={isLoggedIn}
            />
        );
    });
};

ScenarioCard.propTypes = {
    scenarios: PropTypes.array,
    isLoggedIn: PropTypes.bool.isRequired
};

export default ScenarioEntries;
