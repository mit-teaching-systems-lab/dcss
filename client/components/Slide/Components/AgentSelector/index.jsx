import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from '@components/UI';
import AgentSelect from '@components/Admin/AgentSelect';

const ariaLabel = 'Optional AI agent to engage in this discussion:';

function AgentSelector(props) {
  const { agent, label, onChange, type, types = [] } = props;
  const value = agent ? agent.id : null;

  if (type) {
    types.push(type);
  }

  const agentSelectProps = {
    error: false,
    'aria-label': label || ariaLabel,
    fluid: true,
    onSelect: selected => {
      const value = selected
        ? {
            id: selected.id,
            rules: []
          }
        : null;
      onChange({}, { name: 'agent', value });
    },
    placeholder: 'Select an agent',
    search: true,
    selection: true,
    types,
    value
  };

  return (
    <Form.Field>
      <label>{label || ariaLabel}</label>
      <AgentSelect {...agentSelectProps} />
    </Form.Field>
  );
}

AgentSelector.propTypes = {
  agent: PropTypes.any,
  label: PropTypes.string,
  type: PropTypes.string,
  types: PropTypes.array,
  onChange: PropTypes.func
};

export default AgentSelector;
