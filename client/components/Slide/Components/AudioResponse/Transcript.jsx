import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTranscriptOnly } from '@actions/response';
import './AudioResponse.css';

const Blockquote = ({ children }) => {
  return <blockquote className="at__blockquote">{children}</blockquote>;
};

Blockquote.propTypes = {
  children: PropTypes.any
};

class Transcript extends Component {
  constructor(props) {
    super(props);

    const { transcript: transcriptFromProps } = this.props;

    // This ensures that an empty string "transcript" will
    // get the chance to be refreshed (if possible)
    const transcript = transcriptFromProps ? transcriptFromProps : null;

    this.state = {
      transcript
    };

    this.refreshInterval = null;
  }

  get isScenarioRun() {
    return location.pathname.includes('/run/');
  }

  componentWillUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  refresh() {
    this.refreshInterval = setInterval(async () => {
      const transcript = await this.fetchTranscript();

      if (transcript !== this.state.transcript) {
        this.setState({ transcript });
        clearInterval(this.refreshInterval);
      }
    }, 1000);
  }

  async fetchTranscript() {
    let {
      getTranscriptOnly,
      responseId,
      run: { id }
    } = this.props;

    const transcript = await getTranscriptOnly({
      id,
      responseId
    });

    return transcript;
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }

    let { transcript } = this.state;

    // We don't already have a transcript string.
    if (!transcript) {
      transcript = await this.fetchTranscript();
    }

    this.setState({ transcript });
    this.refresh();
  }

  render() {
    const { isReady, transcript } = this.state;

    if (!this.isScenarioRun) {
      return (
        <Blockquote>
          Participant response transcriptions will appear here.
        </Blockquote>
      );
    }

    let content =
      'Transcription in progress. This may take a few minutes, depending on the length of your audio recording.';

    // If the transcript is not null, then the request has been completed,
    // but we still need to determine if the transcript is useful or not.
    if (transcript !== null) {
      // For now, we do an explicit check for empty strings.
      if (transcript === '') {
        content =
          'Transcription process completed, however it appears your audio recording is empty. Please try recording your response again.';
      } else {
        content = transcript;
      }
    }

    return <Blockquote>{content}</Blockquote>;
  }
}

Transcript.propTypes = {
  getTranscriptOnly: PropTypes.func,
  onChange: PropTypes.func,
  responseId: PropTypes.string,
  run: PropTypes.object,
  transcript: PropTypes.string
};

const mapStateToProps = state => {
  const { run } = state;
  return { run };
};

const mapDispatchToProps = dispatch => ({
  getTranscriptOnly: params => dispatch(getTranscriptOnly(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transcript);
