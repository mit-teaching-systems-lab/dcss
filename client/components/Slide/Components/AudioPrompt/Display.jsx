import { type } from './meta';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Segment } from '@components/UI';
import PromptRequiredLabel from '../PromptRequiredLabel';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Display';
import AudioRecorder from '@components/Slide/Components/AudioPrompt/AudioRecorder';
import { getResponse } from '@actions/response';
import '@components/Slide/Components/AudioPrompt/AudioPrompt.css';

class Display extends Component {
  constructor(props) {
    super(props);

    const { persisted = { value: '', transcript: '' } } = this.props;

    this.state = {
      isReady: false,
      autostart: false,
      transcript: persisted.transcript,
      type: '',
      value: persisted.value
    };

    this.created_at = new Date().toISOString();
    this.onChange = this.onChange.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      this.setState({
        isReady: true
      });
      return;
    }
    let {
      getResponse,
      onResponseChange,
      persisted = {},
      responseId,
      run
    } = this.props;

    let { name = responseId, transcript = '', value = '' } = persisted;

    let state = {
      ...this.state
    };

    if (!value || !transcript) {
      const previous = await getResponse({
        id: run.id,
        responseId
      });

      if (previous && previous.response) {
        value = previous.response.value;
        transcript = previous.response.transcript;
      }
    }

    if (value) {
      onResponseChange({}, { name, transcript, value, isFulfilled: true });
      state = {
        ...state,
        transcript,
        value
      };
    }

    this.setState({
      ...state,
      isReady: true
    });
  }

  onChange(event, { isOverride, isFulfilled, name, transcript = '', value }) {
    const { created_at } = this;
    const { recallId } = this.props;
    const ended_at = new Date().toISOString();

    this.props.onResponseChange(event, {
      created_at,
      ended_at,
      isFulfilled,
      isOverride,
      name,
      recallId,
      transcript,
      type,
      value
    });

    this.setState({ transcript, value });
  }

  render() {
    const { isReady, autostart, isRecording, transcript, value } = this.state;

    if (!isReady) {
      return null;
    }

    const {
      persisted,
      prompt,
      recallId,
      responseId,
      required,
      run
    } = this.props;
    const { onChange } = this;
    const isFulfilled = value ? true : false;
    const header = (
      <Header as="h3" tabIndex="0">
        {prompt} {required && <PromptRequiredLabel fulfilled={isFulfilled} />}
      </Header>
    );
    const recalledResponse = recallId ? (
      <ResponseRecall run={run} recallId={recallId} />
    ) : null;

    return (
      <Segment>
        {header}
        {recalledResponse}
        <AudioRecorder
          autostart={autostart}
          getResponse={this.props.getResponse}
          isEmbeddedInSVG={this.props.isEmbeddedInSVG}
          isRecording={isRecording}
          onChange={onChange}
          persisted={persisted}
          prompt={prompt}
          responseId={responseId}
          run={run}
          saveRunEvent={this.props.saveRunEvent}
          transcript={transcript}
          value={value}
        />
      </Segment>
    );
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  isEmbeddedInSVG: PropTypes.bool,
  getResponse: PropTypes.func,
  isRecording: PropTypes.bool,
  onResponseChange: PropTypes.func,
  persisted: PropTypes.object,
  placeholder: PropTypes.string,
  prompt: PropTypes.string,
  recallId: PropTypes.string,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  type: PropTypes.oneOf([type, 'AudioResponse'])
};

const mapStateToProps = state => {
  const { run } = state;
  return { run };
};

const mapDispatchToProps = dispatch => ({
  getResponse: params => dispatch(getResponse(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Display);
