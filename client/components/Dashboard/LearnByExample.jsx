import { Card, Text } from '@components/UI';
import {
  CopyScenarioButton,
  RunScenarioButton
} from '../ScenariosList/ScenarioCardActions';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getExampleScenarios } from '@actions/scenario';

const LearnByExample = () => {
  const dispatch = useDispatch();
  const examples = useSelector(state => state.exampleScenarios);

  useEffect(() => {
    dispatch(getExampleScenarios());
  }, [dispatch]);

  return (
    <section id="learn-by-example">
      <div className="dashboard-subheader">
        <h2>Learn by example</h2>
        <p>
          Run or copy example scenarios created by the team to learn all the
          features of Teacher Moments.
        </p>
      </div>
      <ul className="dashboard-grid">
        {examples.map(scenario => {
          return (
            <li key={`example-scenario-${scenario.idz}`}>
              <Card className="dashboard-card">
                <p className="dashboard-card__title">{scenario.title}</p>
                <Text.Truncate lines={3}>{scenario.description}</Text.Truncate>
                <div className="dashboard-button-group">
                  <RunScenarioButton id={scenario.id} activeRunSlideIndex={0} />
                  <CopyScenarioButton id={scenario.id} />
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default LearnByExample;
