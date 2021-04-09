import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Button } from '@components/UI';
import Identity from '@utils/Identity';
import './Chat.css';

function JoinAsButton(props) {
  const { className = '', cohort, persona, scenario } = props;

  const cohortIdHash = cohort ? Identity.toHash(props.cohort.id) : null;

  const personaIdHash = Identity.toHash(props.persona.id);
  const scenarioIdHash = Identity.toHash(props.scenario.id);

  const href = cohort
    ? `/chat/join/${scenarioIdHash}/as/${personaIdHash}/cohort/${cohortIdHash}`
    : `/chat/join/${scenarioIdHash}/as/${personaIdHash}`;

  return (
    <Button
      fluid
      size="small"
      data-testid="join-scenario-as"
      as={NavLink}
      className={className}
      key={Identity.key(persona)}
      to={href}
    >
      Join as <strong>{persona.name}</strong>
    </Button>
  );
}

JoinAsButton.propTypes = {
  className: PropTypes.string,
  cohort: PropTypes.object,
  persona: PropTypes.object,
  scenario: PropTypes.object
};

export default JoinAsButton;
