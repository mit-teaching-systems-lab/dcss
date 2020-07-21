import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTranscriptionOutcome } from '@actions/response';
import './AudioPrompt.css';

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

    this.interval = null;
    this.intervalCount = 0;
  }

  get isScenarioRun() {
    return location.pathname.includes('/run/');
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  refresh() {
    this.interval = setInterval(async () => {
      const { transcript } = await this.fetchTranscriptOutcome();
      if (transcript !== this.state.transcript) {
        this.setState({ transcript });
        clearInterval(this.interval);
      }

      if (this.intervalCount === 60) {
        this.intervalCount = 0;
        clearInterval(this.interval);
      } else {
        this.intervalCount++;
      }
    }, 1000);
  }

  async fetchTranscriptOutcome() {
    let {
      getTranscriptionOutcome,
      responseId,
      run: { id }
    } = this.props;

    return await getTranscriptionOutcome({
      id,
      responseId
    });
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }

    let { transcript } = this.state;

    // We don't already have a transcript string.
    if (!transcript) {
      const outcome = await this.fetchTranscriptOutcome();
      if (outcome.transcript) {
        transcript = outcome.transcript;
      }
    }

    this.setState({ transcript });
    this.refresh();
  }

  render() {
    const { transcript } = this.state;

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
  getTranscriptionOutcome: PropTypes.func,
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
  getTranscriptionOutcome: params => dispatch(getTranscriptionOutcome(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transcript);