import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Label, Input } from 'semantic-ui-react';
import { type } from './type';
import './CheckResponse.css';

class CheckResponseEditor extends React.Component {
    constructor(props) {
        super(props);
        const {
            prompt = 'Text Prompt (displayed before input field as label)',
            responseId = 'response-1',
            checked,
            unchecked
        } = props.value;
        this.state = {
            prompt,
            checked,
            unchecked,
            responseId
        };

        this.onTextAreaChange = this.onTextAreaChange.bind(this);
    }

    render() {
        const { prompt, checked, unchecked, responseId } = this.state;
        const { onTextAreaChange } = this;
        return (
            <React.Fragment>
                <Form>
                    <Label as="label" className="checkresponse__label">
                        <p>Response ID:</p>
                        <Input
                            name="responseId"
                            value={responseId}
                            onChange={onTextAreaChange}
                            className="checkresponse__input"
                        />
                    </Label>
                    <Label as="label" className="checkresponse__label">
                        <p>Label:</p>
                        <TextArea
                            name="prompt"
                            value={prompt}
                            onChange={onTextAreaChange}
                            className="checkresponse__input"
                        />
                    </Label>
                    <Label as="label" className="checkresponse__label">
                        <p>Unchecked (default) value:</p>
                        <TextArea
                            name="unchecked"
                            value={unchecked}
                            onChange={onTextAreaChange}
                            className="checkresponse__input"
                        />
                    </Label>
                    <Label as="label" className="checkresponse__label">
                        <p>Checked value:</p>
                        <TextArea
                            name="checked"
                            value={checked}
                            onChange={onTextAreaChange}
                            className="checkresponse__input"
                        />
                    </Label>
                </Form>
            </React.Fragment>
        );
    }

    onTextAreaChange(event, { name, value }) {
        this.setState({ [name]: value }, () => {
            const { prompt, checked, unchecked, responseId } = this.state;
            this.props.onChange({
                type,
                prompt,
                checked,
                unchecked,
                responseId
            });
        });
    }
}

CheckResponseEditor.propTypes = {
    value: PropTypes.shape({
        type: PropTypes.oneOf([type]),
        prompt: PropTypes.string,
        checked: PropTypes.string,
        unchecked: PropTypes.string,
        responseId: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired
};

export default CheckResponseEditor;
