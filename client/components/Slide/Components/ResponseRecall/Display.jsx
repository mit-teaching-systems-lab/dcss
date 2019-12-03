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
        // If the scenario is an active "Run":
        //      If there is a response object, but
        //      the response was skipped,
        //      display:
        //      "Prompt skipped"
        //
        //      Otherwise, display the value
        //      that was entered by the participant
        //
        //      In case we're waiting for the response
        //      to load from the server, display:
        //      "Loading your previous response"
        //
        // Otherwise, we're in a preview, so there
        // won't actually be a participant response
        // to display, so display:
        // "Participant response will appear here"
        //
        const content = this.isScenarioRun
            ? response
                ? response.response.isSkip
                    ? 'Prompt skipped'
                    : response.response.value
                : 'Loading your previous response'
            : 'Participant response will appear here';

        return content.endsWith('mp3') ? (
            <audio src={content} controls="controls" />
        ) : (
            <Message style={{ whiteSpace: 'pre-wrap' }} content={content} />
        );
    }
}

Display.propTypes = {
    // This is named `recallId`, instead of `responseId`
    // to prevent the serialized form of this component
    // from being mis-indentified as a "Response" component.
    recallId: PropTypes.string,
    run: PropTypes.object,
    type: PropTypes.oneOf([type])
};

export default React.memo(Display);
