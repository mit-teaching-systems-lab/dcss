import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Checkbox, Container, Form, Icon } from 'semantic-ui-react';
import { type } from './type';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import './TextResponse.css';
import '@components/Slide/SlideEditor/SlideEditor.css';

class TextResponseEditor extends React.Component {
    constructor(props) {
        super(props);
        const {
            prompt = 'Text Prompt (displayed before input field as label)',
            placeholder = 'Placeholder Text',
            recallId = '',
            required,
            responseId = ''
        } = props.value;
        this.state = {
            activeIndex: recallId ? 0 : -1,
            prompt,
            placeholder,
            recallId,
            required,
            responseId
        };

        this.onChange = this.onChange.bind(this);
        this.onRequirementChange = this.onRequirementChange.bind(this);
        this.onRecallChange = this.onRecallChange.bind(this);
        this.toggleOptional = this.toggleOptional.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    render() {
        const {
            activeIndex,
            prompt,
            placeholder,
            recallId,
            required
        } = this.state;
        const { scenarioId } = this.props;
        const {
            onChange,
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
                                    components: [],
                                    recallId
                                }}
                                scenarioId={scenarioId}
                                onChange={onRecallChange}
                            />
                        </Accordion.Content>
                    </Accordion>

                    <Form.TextArea
                        label="Prompt"
                        name="prompt"
                        value={prompt}
                        onChange={onChange}
                    />
                    <Form.TextArea
                        label="Placeholder"
                        name="placeholder"
                        value={placeholder}
                        onChange={onChange}
                    />
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

    updateState() {
        const {
            prompt,
            placeholder,
            recallId,
            required,
            responseId
        } = this.state;
        this.props.onChange({
            type,
            prompt,
            placeholder,
            recallId,
            required,
            responseId
        });
    }

    onRecallChange({ recallId }) {
        this.setState({ recallId }, this.updateState);
    }

    onRequirementChange(event, { name, checked }) {
        this.setState({ [name]: checked }, this.updateState);
    }

    onChange(event, { name, value }) {
        this.setState({ [name]: value }, this.updateState);
    }

    toggleOptional(event, { index }) {
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    }
}

TextResponseEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    scenarioId: PropTypes.string,
    value: PropTypes.shape({
        placeholder: PropTypes.string,
        prompt: PropTypes.string,
        recallId: PropTypes.string,
        required: PropTypes.bool,
        responseId: PropTypes.string,
        type: PropTypes.oneOf([type])
    })
};

export default TextResponseEditor;
