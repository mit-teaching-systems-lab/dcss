import { type } from './meta';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Header, Segment } from '@components/UI';
import PromptRequiredLabel from '../PromptRequiredLabel';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Display';
import AudioRecorder from '@components/Slide/Components/AudioPrompt/AudioRecorder';
import { getResponse } from '@actions/response';
import '@components/Slide/Components/AudioPrompt/AudioPrompt.css';
import './ConversationPrompt.css';

import Hls from 'hls.js';
import Player from 'react-player';

import { YOUTUBE_PLAYER_DISPLAY_VARS } from './constants';

window.Hls = Hls;

class Display extends Component {
  constructor(props) {
    super(props);

    const { persisted = { value: '', transcript: '' } } = this.props;

    this.state = {
      isReady: false,
      autostart: false,
      playing: this.isScenarioRun,
      transcript: persisted.transcript,
      type: '',
      value: persisted.value
    };

    this.created_at = new Date().toISOString();
    this.onChange = this.onChange.bind(this);
  }

  get isScenarioRun() {
    return location.pathname.includes('/run/');
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

  onChange(event, { name, value }) {
    const { created_at } = this;
    const { recallId } = this.props;
    const transcript = '';
    this.props.onResponseChange(event, {
      created_at,
      ended_at: new Date().toISOString(),
      recallId,
      name,
      transcript,
      type,
      value
    });

    this.setState({ transcript, value });
  }

  render() {
    const {
      isReady,
      autostart,
      isRecording,
      playing,
      transcript,
      value
    } = this.state;

    if (!isReady) {
      return null;
    }

    const {
      prompt,
      configuration,
      recallId,
      responseId,
      required,
      run,
      url
    } = this.props;
    const { onChange } = this;
    const isFulfilled = value ? true : false;
    const header = (
      <Fragment>
        {prompt} {required && <PromptRequiredLabel fulfilled={isFulfilled} />}
      </Fragment>
    );

    const config = {
      youtube: {
        ...YOUTUBE_PLAYER_DISPLAY_VARS
      }
    };

    if (configuration.end) {
      config.youtube.playerVars.start = configuration.start;
      config.youtube.playerVars.end = configuration.end;
    }

    const light = !this.isScenarioRun;
    const height = '320px';
    const width = '100%';

    const ref = player => {
      this.player = player;
    };

    const onEnded = () => {
      this.setState({ autostart: true, playing: false });
      this.player.seekTo(configuration.start);
    };

    //
    //
    // TODO: support for "start" and "end" in other players
    // will be need to be manually set.
    //
    // const onProgress = ({playedSeconds}) => {
    //   console.log("duration: ", duration);
    //   console.log("playedSeconds: ", playedSeconds);
    //   console.log("triggerAt: ", triggerAt);
    //   if (configuration.kind === 'slice' && playedSeconds >= triggerAt) {
    //     this.setState({ autostart: true });
    //   } else {
    //     if (duration && playedSeconds >= duration - 0.5) {
    //       console.log("almost the end");
    //     }
    //   }
    // };
    //
    //

    const playerProps = {
      className: 'cp__video-player',
      config,
      light,
      height,
      onEnded,
      // onProgress,
      playing,
      ref,
      width,
      url
    };

    const willShowAudioRecorder = isFulfilled || autostart;

    return (
      <Fragment>
        <Container className="cp__video-wrapper">
          <Player {...playerProps} />
        </Container>
        {willShowAudioRecorder ? (
          <Segment>
            <Header as="h3">{header}</Header>
            {recallId && <ResponseRecall run={run} recallId={recallId} />}
            <AudioRecorder
              autostart={autostart}
              getResponse={this.props.getResponse}
              isEmbeddedInSVG={this.props.isEmbeddedInSVG}
              isRecording={isRecording}
              onChange={onChange}
              responseId={responseId}
              run={run}
              transcript={transcript}
              value={value}
            />
          </Segment>
        ) : null}
      </Fragment>
    );
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  configuration: PropTypes.object,
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
  type: PropTypes.oneOf([type]).isRequired,
  url: PropTypes.string
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
