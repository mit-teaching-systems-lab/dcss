import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, List, Segment } from 'semantic-ui-react';
import PromptRequiredLabel from '../PromptRequiredLabel';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Display';
import { connect } from 'react-redux';
import { getResponse } from '@client/actions/response';

class Display extends React.Component {
    constructor(props) {
        super(props);

        const { persisted } = this.props;

        this.state = {
            value: persisted.value
        };

        this.created_at = new Date().toISOString();
        this.onClick = this.onClick.bind(this);
    }

    async componentDidMount() {
        let {
            getResponse,
            onResponseChange,
            persisted = {},
            responseId,
            run
        } = this.props;

        let { name = responseId, value = '' } = persisted;

        if (!value) {
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

    onClick(event, { name, value }) {
        const { created_at } = this;
        const { onResponseChange, recallId } = this.props;
        onResponseChange(event, {
            created_at,
            ended_at: new Date().toISOString(),
            name,
            recallId,
            type,
            value
        });

        this.setState({ value });
    }

    render() {
        const {
            buttons,
            prompt,
            recallId,
            required,
            responseId,
            run
        } = this.props;
        const { value, value: previousValue } = this.state;
        const { onClick } = this;
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
                <List>
                    {buttons &&
                        buttons.map(({ display, value }, index) => {
                            const selectedIcon =
                                previousValue === value
                                    ? { icon: 'checkmark' }
                                    : {};

                            return (
                                <List.Item key={`list.item-${index}`}>
                                    <Button
                                        fluid
                                        key={`button-${index}`}
                                        content={display}
                                        name={responseId}
                                        value={value}
                                        onClick={onClick}
                                        {...selectedIcon}
                                    />
                                </List.Item>
                            );
                        })}
                </List>
            </Segment>
        );
    }
}

Display.propTypes = {
    buttons: PropTypes.array,
    getResponse: PropTypes.func,
    persisted: PropTypes.object,
    prompt: PropTypes.string,
    recallId: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    run: PropTypes.object,
    onResponseChange: PropTypes.func,
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
