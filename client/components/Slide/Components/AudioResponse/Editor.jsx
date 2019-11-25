import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Form, Input, Message, Popup } from 'semantic-ui-react';
import { type } from './type';
import './AudioResponse.css';

class AudioResponseEditor extends Component {
    constructor(props) {
        super(props);
        const { prompt, responseId } = props.value;
        this.state = {
            prompt,
            responseId
        };

        this.onTextAreaChange = this.onTextAreaChange.bind(this);
    }

    onTextAreaChange(event, { name, value }) {
        this.setState({ [name]: value }, () => {
            const { prompt, responseId } = this.state;
            this.props.onChange({ type, prompt, responseId });
        });
    }

    render() {
        const { prompt } = this.state;
        const { onTextAreaChange } = this;
        return (
            <Form>
                <Container fluid>
                    <Popup
                        content="This is the label that will appear on the Audio Prompt button."
                        trigger={
                            <Input
                                label="Audio Prompt:"
                                name="prompt"
                                value={prompt}
                                onChange={onTextAreaChange}
                            />
                        }
                    />

                    <Message content="Note: This component will fallback to a text input prompt when Audio recording is not supported." />
                </Container>
            </Form>
        );
    }
}

AudioResponseEditor.propTypes = {
    scenarioId: PropTypes.string,
    value: PropTypes.shape({
        type: PropTypes.oneOf([type]),
        prompt: PropTypes.string,
        responseId: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired
};

export default AudioResponseEditor;
