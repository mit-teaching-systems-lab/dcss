import { type } from './type';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Label, Segment, TextArea } from 'semantic-ui-react';

import './TextResponse.css';

class Display extends Component {
    constructor(props) {
        super(props);

        this.createdAt = false;

        this.lastValueChanged = '';

        this.onChange = this.onChange.bind(this);
    }

    onChange(event, data) {
        if (!this.createdAt) {
            this.createdAt = new Date().toISOString();
        }

        const now = new Date();
        const createdAt = new Date(this.createdAt);
        const isOneSecondOrLonger = (now - createdAt) / 1000 > 1;

        // This saves the text response every second
        if (isOneSecondOrLonger) {
            this.props.onResponseChange(
                {},
                {
                    createdAt: this.createdAt,
                    endedAt: now.toISOString(),
                    ...data
                }
            );
            this.createdAt = false;
            this.lastValueChanged = data.value;
        }

        // This condition handles the text area value on submit
        if (this.lastValueChanged !== data.value) {
            this.props.onResponseChange(
                {},
                {
                    createdAt: this.createdAt,
                    endedAt: now.toISOString(),
                    ...data
                }
            );
            this.lastValueChanged = data.value;
        }
    }

    render() {
        const { prompt, placeholder, responseId } = this.props;
        return (
            <Segment>
                <Form>
                    <Form.Field>
                        <Label as="label" className="textresponse__label">
                            <p>{prompt}</p>
                        </Label>
                        <TextArea
                            name={responseId}
                            placeholder={placeholder}
                            onChange={this.onChange}
                        />
                    </Form.Field>
                </Form>
            </Segment>
        );
    }
}

Display.propTypes = {
    prompt: PropTypes.string,
    placeholder: PropTypes.string,
    responseId: PropTypes.string,
    onResponseChange: PropTypes.func,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
