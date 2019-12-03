import { type } from './type';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Header, Segment } from 'semantic-ui-react';
import PromptRequiredLabel from '../PromptRequiredLabel';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Display';
import './TextResponse.css';

class Display extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
        this.created_at = '';
        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onFocus() {
        if (!this.created_at) {
            this.created_at = new Date().toISOString();
        }
    }

    onChange(event, { name, value }) {
        const { created_at } = this;
        this.props.onResponseChange(event, {
            created_at,
            ended_at: new Date().toISOString(),
            name,
            type,
            value
        });

        this.setState({ value });
    }

    render() {
        const {
            prompt,
            placeholder,
            recallId,
            required,
            responseId,
            run
        } = this.props;
        const { value } = this.state;
        const { onFocus, onChange } = this;
        const fulfilled = value ? true : false;
        const header = (
            <React.Fragment>
                {prompt}{' '}
                {required && <PromptRequiredLabel fulfilled={fulfilled} />}
            </React.Fragment>
        );

        return (
            <Segment>
                <Header as="h3">{header}</Header>
                {recallId && <ResponseRecall run={run} recallId={recallId} />}
                <Form>
                    <Form.TextArea
                        name={responseId}
                        placeholder={placeholder}
                        onFocus={onFocus}
                        onChange={onChange}
                    />
                </Form>
            </Segment>
        );
    }
}

Display.propTypes = {
    onResponseChange: PropTypes.func,
    placeholder: PropTypes.string,
    prompt: PropTypes.string,
    recallId: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    run: PropTypes.object,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
