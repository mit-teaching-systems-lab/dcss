import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import '../AudioResponse/AudioResponse.css';

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
        // TODO: replace this with call to getResponse
        const { run, recallId } = this.props;
        if (this.isScenarioRun) {
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

        return (
            <Message
                floating
                style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word'
                }}
                content={
                    content.endsWith('mp3') ? (
                        <React.Fragment>
                            <audio
                                src={`/api/media/${content}`}
                                controls="controls"
                            />
                            <blockquote className="audiotranscript__blockquote">
                                {response.response.transcript ||
                                    '(Transcription in progress. This may take a few minutes, depending on the length of your audio recording.)'}
                            </blockquote>
                        </React.Fragment>
                    ) : (
                        content
                    )
                }
            />
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
