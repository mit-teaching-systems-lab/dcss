import './Dashboard.css';

import { Button, Icon } from '@components/UI';
import { Container, Divider, Header, List, Segment } from '@components/UI';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CohortCard from '../Cohorts/CohortCard';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import { getRecentCohorts } from '@actions/cohort';
import { getScenariosByStatus } from '@actions/scenario';
import { isParticipantOnly } from '@utils/Roles';

const CohortContent = ({ cohorts }) => {
  if (cohorts.length) {
    return (
      <List className="dashboard-grid">
        {cohorts.map(cohort => {
          return (
            <List.Item key={cohort.id}>
              <CohortCard id={cohort.id} />
            </List.Item>
          );
        })}
      </List>
    );
  } else {
    return (
      <Segment secondary padded className="dashboard-empty">
        <p>
          No cohorts created. <a href="#">Create a new cohort.</a>
        </p>
      </Segment>
    );
  }
};

const RecentCohorts = () => {
  const user = useSelector(state => state.user);
  const cohorts = useSelector(state => state.recentCohorts);

  if (isParticipantOnly(user)) {
    return null;
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRecentCohorts());
    dispatch(getScenariosByStatus(SCENARIO_IS_PUBLIC));
  }, [dispatch]);

  return (
    <Container fluid id="recent-cohorts">
      <Header className="dashboard-subheader">
        <Header as="h2">Your most recent cohorts</Header>
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
      </Header>
      <Divider />
      <CohortContent cohorts={cohorts} />
    </Container>
  );
};

export default RecentCohorts;
