import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Label } from '@components/UI';
import './PromptRequiredLabel.css';

const PromptRequiredLabel = ({ fulfilled }) => {
  const color = fulfilled ? 'green' : 'red';
  const name = fulfilled ? 'check' : 'asterisk';

  return (
    <Label className="prl__label-margin" color={color} floating>
      <Icon className="prl__icon-margin" name={name} />
    </Label>
  );
};

PromptRequiredLabel.propTypes = {
  fulfilled: PropTypes.bool
};

export default React.memo(PromptRequiredLabel);
