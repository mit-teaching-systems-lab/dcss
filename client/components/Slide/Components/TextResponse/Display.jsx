import { type } from './type';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Label, Segment, TextArea } from 'semantic-ui-react';

import './TextResponse.css';

class Display extends Component {
    constructor(props) {
        super(props);

        this.created_at = '';
        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onFocus() {
        if (!this.created_at) {
            this.created_at = new Date().toISOString();
        }
    }

    onChange(event, data) {
        const { created_at } = this;
        this.props.onResponseChange(event, {
            ...data,
            created_at,
            ended_at: new Date().toISOString(),
            type
        });
    }

    render() {
        const { prompt, placeholder, responseId } = this.props;
        const { onFocus, onChange } = this;
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
                            onFocus={onFocus}
                            onChange={onChange}
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
