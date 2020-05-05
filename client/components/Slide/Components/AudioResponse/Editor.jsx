import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Form, Input, Message, Popup } from 'semantic-ui-react';
import { type } from './meta';
import DataHeader from '@components/Slide/Components/DataHeader';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import './AudioResponse.css';
import '@components/Slide/SlideEditor/SlideEditor.css';

class AudioResponseEditor extends Component {
    constructor(props) {
        super(props);
        const {
            header = '',
            prompt = '',
            recallId = '',
            responseId
        } = props.value;

        this.state = {
            header,
            prompt,
            recallId,
            responseId
        };
        this.onChange = this.onChange.bind(this);
        this.onRecallChange = this.onRecallChange.bind(this);
    }

    updateState() {
        const { header, prompt, recallId, responseId } = this.state;
        this.props.onChange({
            header,
            prompt,
            recallId,
            responseId,
            type
        });
    }

    onChange(event, { name, value }) {
        this.setState({ [name]: value }, this.updateState);
    }

    onRecallChange({ recallId }) {
        this.setState({ recallId }, this.updateState);
    }

    render() {
        const { header, prompt, recallId } = this.state;
        const { scenarioId, slideIndex } = this.props;
        const { onChange, onRecallChange } = this;

        return (
            <Form>
                <Container fluid>
                    <ResponseRecall
                        value={{ recallId }}
                        scenarioId={scenarioId}
                        slideIndex={slideIndex}
                        onChange={onRecallChange}
                    />

                    <Popup
                        content="This is the label that will appear on the Audio Prompt button."
                        trigger={
                            <Form.Field inline>
                                <Input
                                    label="Audio Prompt:"
                                    name="prompt"
                                    value={prompt}
                                    onChange={onChange}
                                />
                            </Form.Field>
                        }
                    />
                    <Message
                        icon="warning sign"
                        color="orange"
                        content="This component will fallback to a text input prompt when the participant's browser or device does not support audio recording."
                    />

                    <DataHeader content={header} onChange={onChange} />
                </Container>
            </Form>
        );
    }
}

AudioResponseEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    scenarioId: PropTypes.any,
    slideIndex: PropTypes.any,
    value: PropTypes.shape({
        header: PropTypes.string,
        prompt: PropTypes.string,
        recallId: PropTypes.string,
        required: PropTypes.bool,
        responseId: PropTypes.string,
        type: PropTypes.oneOf([type])
    })
};

export default AudioResponseEditor;
