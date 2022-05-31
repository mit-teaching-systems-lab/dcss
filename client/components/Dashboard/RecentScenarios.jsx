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
      primary
      name="Create a new scenario"
      size="small"
      href="/editor/new"
      as="a"
    >
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
      <div className="dashboard-section-header">
        <Header as="h2">Your most recent scenarios</Header>
        <CreateScenarioButton />
        <Button
          secondary
          size="small"
          href={`/scenarios/author/${user.username}/`}
        >
          View my scenarios
        </Button>
        <Button as="a" href="/scenarios">
          View all scenarios
        </Button>
      </div>
      <Divider />
      {scenarios.length ? (
        <Card.Group itemsPerRow="2" stackable>
          {scenarios.map((scenario, index) => {
            return (
              <ScenarioCard
                key={`scenario-card-${scenario.id}-${index}`}
                raised
                scenario={scenario}
                onClick={scenarioCardClickHandler(scenario)}
              >
                <NonClickableScenarioLabels scenario={scenario} />
              </ScenarioCard>
            );
          })}
        </Card.Group>
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
