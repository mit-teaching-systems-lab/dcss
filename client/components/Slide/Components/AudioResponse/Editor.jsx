import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Label, TextArea } from 'semantic-ui-react';
import { type } from './type';
import './AudioResponse.css';

class AudioResponseEditor extends Component {
    constructor(props) {
        super(props);
        const { prompt } = props.value;
        this.state = {
            prompt
        };

        this.onTextAreaChange = this.onTextAreaChange.bind(this);
    }

    onTextAreaChange(event, { name, value }) {
        this.setState({ [name]: value }, () => {
            const { prompt } = this.state;
            this.props.onChange({ type, prompt });
        });
    }

    render() {
        const { prompt } = this.state;
        const { onTextAreaChange } = this;
        return (
            <React.Fragment>
                <Form>
                    <Label>
                        Audio Prompt:
                        <TextArea
                            name="prompt"
                            value={prompt}
                            onChange={onTextAreaChange}
                        />
                    </Label>
                </Form>
            </React.Fragment>
        );
    }
}

AudioResponseEditor.propTypes = {
    value: PropTypes.shape({
        type: PropTypes.oneOf([type]),
        prompt: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired
};

export default AudioResponseEditor;
