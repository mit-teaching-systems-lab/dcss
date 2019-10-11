import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Label, Input } from 'semantic-ui-react';
import { type } from './type';
import './TextResponse.css';

class TextResponseEditor extends React.Component {
    constructor(props) {
        super(props);
        const {
            prompt = 'Text Prompt (displayed before input field as label)',
            placeholder = 'Placehoder Text',
            responseId = 'response-1'
        } = props.value;
        this.state = {
            prompt,
            placeholder,
            responseId
        };

        this.onTextAreaChange = this.onTextAreaChange.bind(this);
    }

    render() {
        const { prompt, placeholder, responseId } = this.state;
        const { onTextAreaChange } = this;
        return (
            <React.Fragment>
                <Form>
                    <Label as="label" className="TextResponse-label">
                        <p>Text Prompt:</p>
                        <TextArea
                            name="prompt"
                            value={prompt}
                            onChange={onTextAreaChange}
                            className="TextResponse-input"
                        />
                    </Label>
                    <Label as="label" className="TextResponse-label">
                        <p>Text Placeholder:</p>
                        <TextArea
                            name="placeholder"
                            value={placeholder}
                            onChange={onTextAreaChange}
                            className="TextResponse-input"
                        />
                    </Label>
                    <Label as="label" className="TextResponse-label">
                        <p>Response ID:</p>
                        <Input
                            name="responseId"
                            value={responseId}
                            onChange={onTextAreaChange}
                            className="TextResponse-input"
                        />
                    </Label>
                </Form>
            </React.Fragment>
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
    value: PropTypes.shape({
        type: PropTypes.oneOf([type]),
        prompt: PropTypes.string,
        placeholder: PropTypes.string,
        responseId: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired
};

export default TextResponseEditor;
