import './Dashboard.css';

import {
  Button,
  Card,
  Container,
  Divider,
  Header,
  Label,
  Segment
} from '@components/UI';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CohortCard from '../Cohorts/CohortCard';
import CohortCreateWizard from '@components/Cohorts/CohortCreateWizard';
import Identity from '@utils/Identity';
import PropTypes from 'prop-types';
import RequestPermissionsLink from './RequestPermissionsLink';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import { getScenariosByStatus } from '@actions/scenario';

const NonClickableCohortScenarios = ({ cohort }) => {
  const scenariosById = useSelector(state => state.scenariosById);

  const labels = cohort.scenarios.reduce((collection, id) => {
    const scenario = scenariosById[id];

    if (scenario) {
      collection.push(
        <Label basic size="small" key={Identity.key({ scenario, cohort })}>
          {scenario.title}
        </Label>
      );
    }

    return collection;
  }, []);

  return <Label.Group>{labels}</Label.Group>;
};

NonClickableCohortScenarios.propTypes = {
  cohort: PropTypes.object
};

const RecentCohorts = ({ cohorts }) => {
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
    dispatch(getScenariosByStatus(SCENARIO_IS_PUBLIC));
  }, [dispatch]);

  const permissions = useSelector(state => state.session.permissions);
  const canCreateCohorts = permissions.includes('create_cohort');

  return (
    <Container fluid id="recent-cohorts">
      <div className="dashboard-section-header">
        <Header as="h2">Your most recent cohorts</Header>
        {canCreateCohorts && (
          <Button
            primary
            name="Create a new cohort"
            size="small"
            onClick={openCohortWizard}
          >
            Create a new cohort
          </Button>
        )}
        <Button as="a" href="/cohorts">
          View all cohorts
        </Button>
        {!canCreateCohorts && (
          <RequestPermissionsLink>
            I want to create a cohort →
          </RequestPermissionsLink>
        )}
      </div>
      <Divider />
      {cohorts.length ? (
        <Card.Group itemsPerRow="2" stackable>
          {cohorts.map(cohort => {
            return (
              <CohortCard raised id={cohort.id} key={cohort.id}>
                <NonClickableCohortScenarios cohort={cohort} />
              </CohortCard>
            );
          })}
        </Card.Group>
      ) : (
        <Segment secondary padded className="dashboard-empty">
          <p>No cohorts created.</p>
        </Segment>
      )}
      {open ? <CohortCreateWizard onCancel={closeCohortWizard} /> : null}
    </Container>
  );
};

RecentCohorts.propTypes = {
  cohorts: PropTypes.array
};

export default RecentCohorts;
