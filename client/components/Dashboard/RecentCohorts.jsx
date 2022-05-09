import './Dashboard.css';

import { Button, Icon } from '@components/UI';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CohortCard from '../Cohorts/CohortCard';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import { getRecentCohorts } from '@actions/cohort';
import { getScenariosByStatus } from '@actions/scenario';

const CohortContent = ({ cohorts }) => {
  if (cohorts.length) {
    return (
      <ul className="dashboard-grid">
        {cohorts.map(cohort => {
          return (
            <li key={cohort.id}>
              <CohortCard id={cohort.id} />
            </li>
          );
        })}
      </ul>
    );
  } else {
    return (
      <div className="dashboard-empty">
        <p>
          No cohorts created. <a href="#">Create a new cohort.</a>
        </p>
      </div>
    );
  }
};

const RecentCohorts = () => {
  const dispatch = useDispatch();
  const cohorts = useSelector(state => state.recentCohorts);

  useEffect(() => {
    dispatch(getRecentCohorts());
    dispatch(getScenariosByStatus(SCENARIO_IS_PUBLIC));
  }, [dispatch]);

  return (
    <section id="recent-cohorts">
      <div className="dashboard-subheader">
        <h2>Your most recent cohorts</h2>
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
          Create a new cohort
        </Button>
        <Button size="small" href="/">
          View all cohorts
        </Button>
      </div>
      <CohortContent cohorts={cohorts} />
    </section>
  );
};

export default RecentCohorts;
