import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Label, Segment, TextArea } from 'semantic-ui-react';

import './TextResponse.css';

const Display = ({ prompt, placeholder, responseId, onResponseChange }) => (
    <Segment>
        <Form>
            <Form.Field>
                <Label as="label" className="textresponse__label">
                    <p>{prompt}</p>
                </Label>
                <TextArea
                    name={responseId}
                    placeholder={placeholder}
                    onChange={onResponseChange}
                />
            </Form.Field>
        </Form>
    </Segment>
);

Display.propTypes = {
    prompt: PropTypes.string,
    placeholder: PropTypes.string,
    responseId: PropTypes.string,
    onResponseChange: PropTypes.func,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
