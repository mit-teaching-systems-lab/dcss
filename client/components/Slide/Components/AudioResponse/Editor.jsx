import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Accordion,
    Container,
    Form,
    Icon,
    Input,
    Label,
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
        const {
            header = '',
            prompt = '',
            recallId = '',
            required,
            responseId
        } = props.value;
        this.state = {
            activeIndex: recallId ? 0 : -1,
            header,
            prompt,
            recallId,
            required,
            responseId
        };
        this.onChange = this.onChange.bind(this);
        this.onRecallChange = this.onRecallChange.bind(this);
        this.toggleOptional = this.toggleOptional.bind(this);
    }

    updateState() {
        const { header, prompt, recallId, required, responseId } = this.state;
        this.props.onChange({
            header,
            prompt,
            recallId,
            required,
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

    toggleOptional(event, { index }) {
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    }

    render() {
        const { activeIndex, header, prompt, recallId } = this.state;
        const { scenarioId } = this.props;
        const { onChange, onRecallChange, toggleOptional } = this;

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
                            <Form.Field inline>
                                <Input
                                    label="Audio Prompt:"
                                    name="prompt"
                                    value={prompt}
                                    onChange={onChange}
                                />
                                <Label pointing="left">
                                    This component will fallback to a text input
                                    prompt when Audio recording is not
                                    supported.
                                </Label>
                            </Form.Field>
                        }
                    />

                    <Message
                        color={header ? 'grey' : 'pink'}
                        content={
                            <Popup
                                content="Set a data header. This is only displayed in the data view and data download."
                                trigger={
                                    <Form.TextArea
                                        required
                                        label="Data Header"
                                        name="header"
                                        value={header}
                                        onChange={onChange}
                                    />
                                }
                            />
                        }
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
        header: PropTypes.string,
        prompt: PropTypes.string,
        recallId: PropTypes.string,
        required: PropTypes.bool,
        responseId: PropTypes.string,
        type: PropTypes.oneOf([type])
    })
};

export default AudioResponseEditor;
