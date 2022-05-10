import './Dashboard.css';

import { Button, Icon } from '@components/UI';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ScenarioCard from '@components/ScenariosList/ScenarioCard';
import { getRecentScenarios } from '@actions/scenario';

const ScenarioContent = ({ scenarios = [] }) => {
  if (scenarios.length) {
    return (
      <ul className="dashboard-grid">
        {scenarios.map((scenario, index) => {
          return (
            <li key={`scenario-card-${scenario.id}-${index}`}>
              <ScenarioCard scenario={scenario} />
            </li>
          );
        })}
      </ul>
    );
  } else {
    return (
      <div className="dashboard-empty">
        <p>
          No scenarios created. <a href="#">Create a new scenario.</a>
        </p>
      </div>
    );
  }
};

const RecentScenarios = () => {
  const dispatch = useDispatch();
  const scenarios = useSelector(state => state.recentScenarios);

  useEffect(() => {
    dispatch(getRecentScenarios());
  }, [dispatch]);

  return (
    <section id="recent-scenarios">
      <div className="dashboard-subheader">
        <h2>Your most recent scenarios</h2>
        <Button
          icon
          primary
          labelPosition="left"
          name="Create a new cohort"
          size="small"
          href="/"
          as="a"
        >
          <Icon name="add" />
          Create a new scenario
        </Button>
        <Button size="small" href="/scenarios">
          View all scenarios
        </Button>
      </div>
      <ScenarioContent scenarios={scenarios} />
    </section>
  );
};

export default RecentScenarios;
