import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Container, Form } from 'semantic-ui-react';
import { type } from './type';
import './TextResponse.css';

class TextResponseEditor extends React.Component {
    constructor(props) {
        super(props);
        const {
            prompt = 'Text Prompt (displayed before input field as label)',
            placeholder = 'Placeholder Text',
            required,
            responseId = ''
        } = props.value;
        this.state = {
            prompt,
            placeholder,
            required,
            responseId
        };

        this.onTextareaChange = this.onTextareaChange.bind(this);
        this.onRequirementChange = this.onRequirementChange.bind(this);
    }

    render() {
        const { prompt, placeholder, required } = this.state;
        const { onTextareaChange, onRequirementChange } = this;
        return (
            <Form>
                <Container fluid>
                    <Form.TextArea
                        label="Prompt"
                        name="prompt"
                        value={prompt}
                        onChange={onTextareaChange}
                    />
                    <Form.TextArea
                        label="Placeholder"
                        name="placeholder"
                        value={placeholder}
                        onChange={onTextareaChange}
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
        const { prompt, placeholder, required, responseId } = this.state;
        this.props.onChange({
            type,
            prompt,
            placeholder,
            required,
            responseId
        });
    }

    onRequirementChange(event, { name, checked }) {
        this.setState({ [name]: checked }, this.updateState);
    }

    onTextareaChange(event, { name, value }) {
        this.setState({ [name]: value }, this.updateState);
    }
}

TextResponseEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    scenarioId: PropTypes.string,
    value: PropTypes.shape({
        placeholder: PropTypes.string,
        prompt: PropTypes.string,
        required: PropTypes.bool,
        responseId: PropTypes.string,
        type: PropTypes.oneOf([type])
    })
};

export default TextResponseEditor;
