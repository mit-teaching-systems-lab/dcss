import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Label } from 'semantic-ui-react';
import './PromptRequiredLabel.css';

const PromptRequiredLabel = ({ fulfilled }) => {
    const color = fulfilled ? 'green' : 'red';
    const name = fulfilled ? 'check' : 'asterisk';

    return (
        <Label color={color} floating>
            <Icon name={name} className="promptrequiredlabel__icon-margin" />
        </Label>
    );
};

PromptRequiredLabel.propTypes = {
    fulfilled: PropTypes.bool
};

export default React.memo(PromptRequiredLabel);
