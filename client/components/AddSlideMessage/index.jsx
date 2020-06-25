import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Message } from '@components/UI';

function AddSlideMessage({ onClick }) {
  return (
    <Message
      floating
      icon={
        <Icon.Group
          size="huge"
          style={{
            marginRight: '0.5rem !important'
          }}
        >
          <Icon name="plus square outline" />
          <Icon corner="top right" name="add" color="green" />
        </Icon.Group>
      }
      header="Click to add a slide"
      onClick={onClick}
      style={{
        cursor: 'pointer'
      }}
    />
  );
}

AddSlideMessage.propTypes = {
  onClick: PropTypes.func
};

export default AddSlideMessage;
