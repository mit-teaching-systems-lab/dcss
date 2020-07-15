import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Message } from '@components/UI';

function AddSlideMessage({ onClick }) {
  return (
    <Message
      icon
      onClick={onClick}
      style={{
        cursor: 'pointer',
        padding: '0.25rem 0.5rem !important'
      }}
    >
      <Icon
        size="huge"
        name="plus square outline"
        style={{ marginRight: '0.25rem !important' }}
      />
      <Message.Content>
        <Message.Header>Click to add a slide</Message.Header>
      </Message.Content>
    </Message>
  );
}

AddSlideMessage.propTypes = {
  onClick: PropTypes.func
};

export default AddSlideMessage;
