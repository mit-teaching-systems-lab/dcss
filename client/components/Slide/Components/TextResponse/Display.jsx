import { type } from './type';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Header, Segment } from 'semantic-ui-react';
import PromptRequiredLabel from '../PromptRequiredLabel';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Display';
import { connect } from 'react-redux';
import { getResponse } from '@client/actions/response';

import './TextResponse.css';

class Display extends Component {
    constructor(props) {
        super(props);

        const { persisted } = this.props;

        this.state = {
            value: persisted.value
        };

        this.created_at = '';
        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    get isScenarioRun() {
        return location.pathname.includes('/run/');
    }

    async componentDidMount() {
        if (!this.isScenarioRun) {
            return;
        }

        let {
            getResponse,
            onResponseChange,
            persisted = {},
            responseId,
            run
        } = this.props;

        let { name = responseId, value = '' } = persisted;

        if (!value && run.id) {
            const previous = await getResponse({
                id: run.id,
                responseId
            });

            if (previous && previous.response) {
                value = previous.response.value;
            }
        }

        if (value) {
            onResponseChange({}, { name, value, isFulfilled: true });
            this.setState({ value });
        }
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
                        defaultValue={value}
                    />
                </Form>
            </Segment>
        );
    }
}

Display.propTypes = {
    getResponse: PropTypes.func,
    onResponseChange: PropTypes.func,
    persisted: PropTypes.object,
    placeholder: PropTypes.string,
    prompt: PropTypes.string,
    recallId: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    run: PropTypes.object,
    type: PropTypes.oneOf([type]).isRequired
};

function mapStateToProps(state) {
    const { run } = state;
    return { run };
}

const mapDispatchToProps = dispatch => ({
    getResponse: params => dispatch(getResponse(params))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Display);
