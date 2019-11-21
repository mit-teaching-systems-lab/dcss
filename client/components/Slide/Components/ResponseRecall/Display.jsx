import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

class Display extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            response: null
        };
    }

    get isScenarioRun() {
        return location.pathname.includes('/run/');
    }

    async componentDidMount() {
        const { run, recallId } = this.props;
        if (run) {
            const { response, status } = await (await fetch(
                `/api/runs/${run.id}/response/${recallId}`
            )).json();

            if (status === 200) {
                this.setState({
                    response
                });
            }
        }
    }
    render() {
        const { response } = this.state;

        const content = this.isScenarioRun
            ? response
                ? response.response.value
                : 'Loading your previous response'
            : 'Participant response will appear here.';

        return <Message style={{ whiteSpace: 'pre-wrap' }} content={content} />;
    }
}

Display.propTypes = {
    // This is named `recallId`, instead of `responseId`
    // to prevent the serialized form of this component
    // from being mis-indentified as a "Response" component.
    recallId: PropTypes.string,
    run: PropTypes.object,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
