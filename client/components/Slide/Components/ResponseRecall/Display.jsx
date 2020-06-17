import { type } from './meta';
import React from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import { Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getResponse } from '@actions/response';
import '../AudioResponse/AudioResponse.css';

class Display extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      response: this.props.responsesById[this.props.recallId] || null
    };
    this.pollForNewResponse = this.pollForNewResponse.bind(this);
    this.interval = null;
  }

  get isScenarioRun() {
    return location.pathname.includes('/run/');
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }

    let {
      getResponse,
      recallId: responseId,
      // eslint-disable-next-line no-unused-vars
      responsesById,
      run: { id }
    } = this.props;

    if (!responseId || responseId === -1) {
      return;
    }

    const { response } = await getResponse({ id, responseId });

    this.setState({
      response: response || this.state.response
    });

    if (response && response.type === 'AudioResponse') {
      this.pollForNewResponse();
    }
  }

  async pollForNewResponse() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    const {
      getResponse,
      recallId: responseId,
      run: { id }
    } = this.props;

    this.interval = setInterval(async () => {
      const previous = await getResponse({
        id,
        responseId
      });

      if (previous) {
        const { response } = previous;

        if (hash(response) !== hash(this.state.response)) {
          clearInterval(this.interval);
          this.setState({
            response
          });
        }
      }
    }, 2000);
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
        ? response.isSkip
          ? 'Prompt skipped'
          : response.value
        : false
      : 'Participant response will appear here';

    if (content === false) {
      return null;
    }

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
              <audio src={`/api/media/${content}`} controls="controls" />
              <blockquote className="audiotranscript__blockquote">
                {response.transcript ||
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
  getResponse: PropTypes.func,
  responsesById: PropTypes.object,
  // This is named `recallId`, instead of `responseId`
  // to prevent the serialized form of this component
  // from being mis-indentified as a "Response" component.
  recallId: PropTypes.string,
  run: PropTypes.object,
  type: PropTypes.oneOf([type])
};

const mapStateToProps = state => {
  const { run, responsesById } = state;
  return { run, responsesById };
};

const mapDispatchToProps = dispatch => ({
  getResponse: params => dispatch(getResponse(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Display);
