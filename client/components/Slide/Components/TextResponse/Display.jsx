import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';
import { Label, TextArea } from 'semantic-ui-react';

import './TextResponse.css';

const Display = ({ prompt, placeholder, responseId, onResponseChange }) => (
    <React.Fragment>
        <Label as="label" className="textresponse__label">
            <p>{prompt}</p>
            <TextArea
                name={responseId}
                placeholder={placeholder}
                onChange={onResponseChange}
                className="textresponse__input"
            />
        </Label>
    </React.Fragment>
);

Display.propTypes = {
    prompt: PropTypes.string,
    placeholder: PropTypes.string,
    responseId: PropTypes.string,
    onResponseChange: PropTypes.func,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
