import './Dashboard.css';

import { Button, Icon } from '@components/UI';
import { Container, Header, List, Segment } from '@components/UI';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import RequestPermissionsLink from './RequestPermissionsLink';
import ScenarioCard from '@components/ScenariosList/ScenarioCard';
import ScenarioDetailModal from '@components/ScenariosList/ScenarioDetailModal';
import { getRecentScenarios } from '@actions/scenario';

const CreateScenarioButton = () => {
  return (
    <Button
      icon
      primary
      labelPosition="left"
      name="Create a new scenario"
      size="small"
      href="/editor/new"
      as="a"
    >
      <Icon name="add" />
      Create a new scenario
    </Button>
  );
};

const ScenarioButtonGroup = () => {
  const user = useSelector(state => state.user);
  const permissions = useSelector(state => state.session.permissions);
  const canCreateScenarios = permissions.includes('create_scenario');

  return (
    <Header.Subheader className="dashboard-subheader">
      {canCreateScenarios && <CreateScenarioButton />}
      <Button secondary size="small" href="/scenarios">
        View all scenarios
      </Button>
      {canCreateScenarios ? (
        <Button size="small" href={`/scenarios/author/${user.username}/`}>
          View my scenarios
        </Button>
      ) : (
        <RequestPermissionsLink>
          I want to create scenarios →
        </RequestPermissionsLink>
      )}
    </Header.Subheader>
  );
};

const RecentScenarios = () => {
  const dispatch = useDispatch();
  const scenarios = useSelector(state => state.recentScenarios);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const scenarioCardClickHandler = scenario => {
    return () => {
      setSelected(scenario);
      setOpen(true);
    };
  };

  const onScenarioModalClose = () => {
    setSelected(null);
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getRecentScenarios());
  }, [dispatch]);

  return (
    <Container fluid id="recent-scenarios">
      <Header as="h2">Your most recent scenarios</Header>
      <ScenarioButtonGroup />
      {scenarios.length ? (
        <List className="dashboard-grid">
          {scenarios.map((scenario, index) => {
            return (
              <List.Item key={`scenario-card-${scenario.id}-${index}`}>
                <ScenarioCard
                  scenario={scenario}
                  onClick={scenarioCardClickHandler(scenario)}
                />
              </List.Item>
            );
          })}
        </List>
      ) : (
        <Segment secondary padded className="dashboard-empty">
          <p>No scenarios created.</p>
        </Segment>
      )}
      {selected ? (
        <ScenarioDetailModal
          open={open}
          onClose={onScenarioModalClose}
          scenario={selected}
        />
      ) : null}
    </Container>
  );
};

export default RecentScenarios;
