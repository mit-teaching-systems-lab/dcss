import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form } from 'semantic-ui-react';
import { type } from './type';
import './TextResponse.css';

class TextResponseEditor extends React.Component {
    constructor(props) {
        super(props);
        const {
            prompt = 'Text Prompt (displayed before input field as label)',
            placeholder = 'Placeholder Text',
            responseId = ''
        } = props.value;
        this.state = {
            prompt,
            placeholder,
            responseId
        };

        this.onTextAreaChange = this.onTextAreaChange.bind(this);
    }

    render() {
        const { prompt, placeholder } = this.state;
        const { onTextAreaChange } = this;
        return (
            <Form>
                <Container fluid>
                    <Form.TextArea
                        label="Prompt"
                        name="prompt"
                        value={prompt}
                        onChange={onTextAreaChange}
                    />
                    <Form.TextArea
                        label="Placeholder"
                        name="placeholder"
                        value={placeholder}
                        onChange={onTextAreaChange}
                    />
                </Container>
            </Form>
        );
    }

    onTextAreaChange(event, { name, value }) {
        this.setState({ [name]: value }, () => {
            const { prompt, placeholder, responseId } = this.state;
            this.props.onChange({ type, prompt, placeholder, responseId });
        });
    }
}

TextResponseEditor.propTypes = {
    scenarioId: PropTypes.string,
    value: PropTypes.shape({
        type: PropTypes.oneOf([type]),
        prompt: PropTypes.string,
        placeholder: PropTypes.string,
        responseId: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired
};

export default TextResponseEditor;
