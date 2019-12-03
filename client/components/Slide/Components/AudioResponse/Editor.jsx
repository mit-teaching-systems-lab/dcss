import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Accordion,
    Checkbox,
    Container,
    Form,
    Icon,
    Input,
    Message,
    Popup
} from 'semantic-ui-react';
import { type } from './type';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import './AudioResponse.css';
import '@components/Slide/SlideEditor/SlideEditor.css';

class AudioResponseEditor extends Component {
    constructor(props) {
        super(props);
        const { prompt, recallId = '', required, responseId } = props.value;
        this.state = {
            activeIndex: recallId ? 0 : -1,
            prompt,
            recallId,
            required,
            responseId
        };
        this.onPromptChange = this.onPromptChange.bind(this);
        this.onRequirementChange = this.onRequirementChange.bind(this);
        this.onRecallChange = this.onRecallChange.bind(this);
        this.toggleOptional = this.toggleOptional.bind(this);
    }

    updateState() {
        const { prompt, recallId, required, responseId } = this.state;
        this.props.onChange({ prompt, recallId, required, responseId, type });
    }

    onPromptChange(event, { value }) {
        this.setState({ prompt: value }, this.updateState);
    }

    onRecallChange({ recallId }) {
        this.setState({ recallId }, this.updateState);
    }

    onRequirementChange(event, { checked }) {
        this.setState({ required: checked }, this.updateState);
    }

    toggleOptional(event, { index }) {
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    }

    render() {
        const { activeIndex, prompt, recallId, required } = this.state;
        const { scenarioId } = this.props;
        const {
            onPromptChange,
            onRecallChange,
            onRequirementChange,
            toggleOptional
        } = this;
        return (
            <Form>
                <Container fluid>
                    <Accordion>
                        <Accordion.Title
                            active={activeIndex === 0}
                            index={0}
                            onClick={toggleOptional}
                        >
                            <Icon name="dropdown" />
                            Optionally Embed A Previous Response
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 0}>
                            <ResponseRecall
                                className="responserecall__margin-bottom"
                                value={{
                                    recallId
                                }}
                                scenarioId={scenarioId}
                                onChange={onRecallChange}
                            />
                        </Accordion.Content>
                    </Accordion>

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
        recallId: PropTypes.string,
        required: PropTypes.bool,
        responseId: PropTypes.string,
        type: PropTypes.oneOf([type])
    })
};

export default AudioResponseEditor;
