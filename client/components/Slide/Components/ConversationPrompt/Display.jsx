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
import {
  VIDEO_PLAYBACK_INSTANT_END,
  VIDEO_PLAYBACK_INSTANT_START
} from '@hoc/withRunEventCapturing';

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
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      this.setState({
        isReady: true
      });
      return;
    }
    let { onResponseChange, persisted = {}, responseId, run } = this.props;

    let { name = responseId, transcript = '', value = '' } = persisted;

    let state = {
      ...this.state
    };

    if (!value || !transcript) {
      const previous = await this.props.getResponse(run.id, responseId);

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

  onChange(
    event,
    { isFulfillmentOverride, isFulfilled, name, transcript = '', value }
  ) {
    const { created_at } = this;
    const { recallId } = this.props;
    const ended_at = new Date().toISOString();

    this.props.onResponseChange(event, {
      created_at,
      ended_at,
      isFulfilled,
      isFulfillmentOverride,
      name,
      recallId,
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
      persisted,
      prompt,
      configuration,
      recallId,
      recallSharedWithRoles,
      responseId,
      required,
      run,
      url
    } = this.props;
    const { onChange } = this;
    const isFulfilled = value ? true : false;
    const header = (
      <Header as="h3" tabIndex="0">
        {prompt} {required && <PromptRequiredLabel fulfilled={isFulfilled} />}
      </Header>
    );

    const recalledResponse = recallId ? (
      <ResponseRecall
        run={run}
        recallId={recallId}
        recallSharedWithRoles={recallSharedWithRoles}
      />
    ) : null;

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

    const context = {
      prompt,
      responseId
    };

    const onEvent = (which, eventContext) => {
      this.props.saveRunEvent(which, {
        ...context,
        ...eventContext
      });
    };

    const onEnded = () => {
      onEvent(VIDEO_PLAYBACK_INSTANT_END, {});
      this.setState({ autostart: true, playing: false });
      this.player.seekTo(configuration.start);
    };

    const onStart = () => {
      onEvent(VIDEO_PLAYBACK_INSTANT_START, {});
    };

    /*

    TODO: figure out how to differentiate "user clicked play/pause" from "program play/pause"
    let isPaused = false;
    const onPause = (event) => {
      if (!isPaused) {
        isPaused = true;
        onEvent(VIDEO_PLAYBACK_INSTANT_INTERRUPTION_PAUSE, {});
      }
    };

    const onPlay = (event) => {
      if (isPaused) {
        isPaused = false;
        onEvent(VIDEO_PLAYBACK_INSTANT_INTERRUPTION_PLAY, {});
      }
    };
    */

    /*
    TODO: support for "start" and "end" in other players
    will be need to be manually set.

    const onProgress = ({playedSeconds}) => {
      console.log("duration: ", duration);
      console.log("playedSeconds: ", playedSeconds);
      console.log("triggerAt: ", triggerAt);
      if (configuration.kind === 'slice' && playedSeconds >= triggerAt) {
        this.setState({ autostart: true });
      } else {
        if (duration && playedSeconds >= duration - 0.5) {
          console.log("almost the end");
        }
      }
    };

    */

    const playerProps = {
      className: 'cp__video-player',
      config,
      light,
      height,
      onEnded,
      onStart,
      playing,
      ref,
      width,
      url
    };

    const willShowAudioRecorder = isFulfilled || autostart;

    return url ? (
      <Fragment>
        <Container className="cp__video-wrapper">
          <Player {...playerProps} />
        </Container>
        {willShowAudioRecorder ? (
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
        ) : null}
      </Fragment>
    ) : null;
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
  recallSharedWithRoles: PropTypes.array,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  type: PropTypes.oneOf([type]).isRequired,
  url: PropTypes.string
};

const mapStateToProps = state => {
  const { run } = state;
  return { run };
};

const mapDispatchToProps = dispatch => ({
  getResponse: (...params) => dispatch(getResponse(...params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Display);
