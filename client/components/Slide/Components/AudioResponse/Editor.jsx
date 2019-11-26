import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Checkbox,
    Container,
    Form,
    Input,
    Message,
    Popup
} from 'semantic-ui-react';
import { type } from './type';
import './AudioResponse.css';

class AudioResponseEditor extends Component {
    constructor(props) {
        super(props);
        const { prompt, required, responseId } = props.value;
        this.state = {
            prompt,
            required,
            responseId
        };
        this.onPromptChange = this.onPromptChange.bind(this);
        this.onRequirementChange = this.onRequirementChange.bind(this);
    }

    updateState() {
        const { prompt, required, responseId } = this.state;
        this.props.onChange({ prompt, required, responseId, type });
    }

    onRequirementChange(event, { checked }) {
        this.setState({ required: checked }, this.updateState);
    }

    onPromptChange(event, { value }) {
        this.setState({ prompt: value }, this.updateState);
    }

    render() {
        const { prompt, required } = this.state;
        const { onPromptChange, onRequirementChange } = this;
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
                                onChange={onPromptChange}
                            />
                        }
                    />

                    <Message content="Note: This component will fallback to a text input prompt when Audio recording is not supported." />

                    <Checkbox
                        name="required"
                        label="Required?"
                        checked={required}
                        onChange={onRequirementChange}
                    />
                </Container>
            </Form>
        );
    }
}

AudioResponseEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    scenarioId: PropTypes.string,
    value: PropTypes.shape({
        prompt: PropTypes.string,
        required: PropTypes.bool,
        responseId: PropTypes.string,
        type: PropTypes.oneOf([type])
    })
};

export default AudioResponseEditor;
