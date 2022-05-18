import './Dashboard.css';

import { Button, Icon } from '@components/UI';
import { Container, Header, List, Segment } from '@components/UI';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CohortCard from '../Cohorts/CohortCard';
import CohortCreateWizard from '@components/Cohorts/CohortCreateWizard';
import RequestPermissionsLink from './RequestPermissionsLink';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import { getRecentCohorts } from '@actions/cohort';
import { getScenariosByStatus } from '@actions/scenario';
import { isParticipantOnly } from '@utils/Roles';

const RecentCohorts = () => {
  const dispatch = useDispatch();
  const [open, setIsOpen] = useState(false);

  const openCohortWizard = e => {
    e.preventDefault();
    setIsOpen(true);
  };

  const closeCohortWizard = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    dispatch(getRecentCohorts());
    dispatch(getScenariosByStatus(SCENARIO_IS_PUBLIC));
  }, [dispatch]);

  const user = useSelector(state => state.user);
  const cohorts = useSelector(state => state.recentCohorts);
  const permissions = useSelector(state => state.session.permissions);

  if (isParticipantOnly(user) && cohorts.length == 0) {
    return null;
  }

  const canCreateCohorts = permissions.includes('create_cohort');

  return (
    <Container fluid id="recent-cohorts">
      <Header as="h2">Your most recent cohorts</Header>
      <Header.Subheader className="dashboard-subheader">
        {canCreateCohorts && (
          <Button
            icon
            primary
            labelPosition="left"
            name="Create a new cohort"
            size="small"
            onClick={openCohortWizard}
          >
            <Icon name="add" />
            Create a new cohort
          </Button>
        )}
        <Button size="small" href="/">
          View all cohorts
        </Button>
        {!canCreateCohorts && (
          <RequestPermissionsLink>
            I want to create a cohort →
          </RequestPermissionsLink>
        )}
      </Header.Subheader>
      {cohorts.length ? (
        <List className="dashboard-grid">
          {cohorts.map(cohort => {
            return (
              <List.Item key={cohort.id}>
                <CohortCard id={cohort.id} />
              </List.Item>
            );
          })}
        </List>
      ) : (
        <Segment secondary padded className="dashboard-empty">
          <p>No cohorts created.</p>
        </Segment>
      )}
      {open ? <CohortCreateWizard onCancel={closeCohortWizard} /> : null}
    </Container>
  );
};

export default RecentCohorts;
