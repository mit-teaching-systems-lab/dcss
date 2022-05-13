import './Dashboard.css';

import { Button, Icon } from '@components/UI';
import { Container, Divider, Header, List, Segment } from '@components/UI';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ScenarioCard from '@components/ScenariosList/ScenarioCard';
import ScenarioDetailModal from '@components/ScenariosList/ScenarioDetailModal';
import { getRecentScenarios } from '@actions/scenario';

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
      <Header className="dashboard-subheader">
        <Header as="h2">Your most recent scenarios</Header>
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
        <Button size="small" href="/scenarios">
          View all scenarios
        </Button>
      </Header>
      <Divider />
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
          <p>
            No scenarios created.{' '}
            <a href="/editor/new">Create a new scenario.</a>
          </p>
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
