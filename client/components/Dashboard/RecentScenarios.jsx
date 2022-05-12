import './Dashboard.css';

import { Button, Icon } from '@components/UI';
import { Container, Divider, Header, List, Segment } from '@components/UI';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ScenarioCard from '@components/ScenariosList/ScenarioCard';
import { getRecentScenarios } from '@actions/scenario';

const ScenarioContent = ({ scenarios = [] }) => {
  if (scenarios.length) {
    return (
      <List className="dashboard-grid">
        {scenarios.map((scenario, index) => {
          return (
            <List.Item key={`scenario-card-${scenario.id}-${index}`}>
              <ScenarioCard scenario={scenario} />
            </List.Item>
          );
        })}
      </List>
    );
  } else {
    return (
      <Segment secondary padded className="dashboard-empty">
        <p>
          No scenarios created. <a href="#">Create a new scenario.</a>
        </p>
      </Segment>
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
      <ScenarioContent scenarios={scenarios} />
    </Container>
  );
};

export default RecentScenarios;
