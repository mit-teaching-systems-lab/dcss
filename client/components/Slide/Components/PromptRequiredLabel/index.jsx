import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Label, Popup } from '@components/UI';
import './PromptRequiredLabel.css';

const PromptRequiredLabel = ({ fulfilled }) => {
  const color = fulfilled ? 'green' : 'red';
  const name = fulfilled ? 'check' : 'asterisk';
  const content = fulfilled
    ? 'This required prompt has been fulfilled.'
    : 'This prompt requires a response.';
  const position = 'top right';
  const size = 'tiny';
  const trigger = <Icon className="prl__icon-margin" name={name} />;
  return (
    <Label
      className="prl__label-margin"
      aria-label={content}
      color={color}
      floating
    >
      <Popup
        inverted
        pinned
        content={content}
        position={position}
        size={size}
        trigger={trigger}
      />
    </Label>
  );
};

PromptRequiredLabel.propTypes = {
  fulfilled: PropTypes.bool
};

export default React.memo(PromptRequiredLabel);
