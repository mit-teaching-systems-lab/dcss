import './Dashboard.css';

import { Button, Icon, Label } from '@components/UI';
import { Container, Header, List, Segment } from '@components/UI';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Identity from '@utils/Identity';
import PropTypes from 'prop-types';
import ScenarioCard from '@components/ScenariosList/ScenarioCard';
import ScenarioDetailModal from '@components/ScenariosList/ScenarioDetailModal';
import { getRecentScenarios } from '@actions/scenario';

const NonClickableScenarioLabels = ({ scenario }) => {
  const { labels } = scenario;

  return (
    <Label.Group>
      {labels.map(value => {
        const key = Identity.key({ value, scenario });

        return (
          <Label size="small" value={value} key={key}>
            {value}
          </Label>
        );
      })}
    </Label.Group>
  );
};

NonClickableScenarioLabels.propTypes = {
  scenario: PropTypes.shape({
    labels: PropTypes.array
  })
};

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

const RecentScenarios = () => {
  const dispatch = useDispatch();
  const scenarios = useSelector(state => state.recentScenarios);
  const user = useSelector(state => state.user);
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
      <Header.Subheader className="dashboard-subheader">
        <CreateScenarioButton />
        <Button
          secondary
          size="small"
          href={`/scenarios/author/${user.username}/`}
        >
          View my scenarios
        </Button>
        <Button size="small" href="/scenarios">
          View all scenarios
        </Button>
      </Header.Subheader>
      {scenarios.length ? (
        <List className="dashboard-grid">
          {scenarios.map((scenario, index) => {
            return (
              <List.Item key={`scenario-card-${scenario.id}-${index}`}>
                <ScenarioCard
                  scenario={scenario}
                  onClick={scenarioCardClickHandler(scenario)}
                >
                  <NonClickableScenarioLabels scenario={scenario} />
                </ScenarioCard>
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
