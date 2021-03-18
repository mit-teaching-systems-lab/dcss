import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { connect } from 'react-redux';
import { Button, Form, Grid, Icon, Ref } from '@components/UI';
import Recorder from '@utils/Recorder';
import AudioPlayer from './AudioPlayer';
import Transcript from './Transcript';
import Media, { IS_AUDIO_RECORDING_SUPPORTED } from '@utils/Media';
import { getResponse } from '@actions/response';
import './AudioPrompt.css';
import {
  AUDIO_PLAYBACK_MANUAL_PAUSE,
  AUDIO_PLAYBACK_MANUAL_PLAY,
  AUDIO_RECORD_INSTANT_START,
  AUDIO_RECORD_INSTANT_STOP,
  AUDIO_RECORD_MANUAL_START,
  AUDIO_RECORD_MANUAL_STOP
} from '@hoc/withRunEventCapturing';

class AudioRecorder extends Component {
  constructor(props) {
    super(props);

    const { transcript = '', value = '' } = this.props;

    this.state = {
      blobURL: '',
      isRecording: false,
      hasPreviousResponse: false,
      transcript,
      value
    };

    this.created_at = new Date().toISOString();
    this.recorder = new Recorder({ bitRate: 128 });
    this.innerRef = this.innerRef.bind(this);
    this.audioNode = this.props.audioNode || null;

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onStartClick = this.onStartClick.bind(this);
    this.onStopClick = this.onStopClick.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }
    let { persisted = {}, responseId, run } = this.props;
    let { name = responseId, transcript = '', value = '' } = persisted;
    let needsFulfillmentSignal = false;
    let hasPreviousResponse = false;

    if (!transcript && this.props.transcript) {
      transcript = this.props.transcript;
    }

    if (!value && this.props.value) {
      value = this.props.value;
    }

    if (!value || !transcript) {
      const previous = await this.props.getResponse(run.id, responseId);

      if (previous && previous.response) {
        value = previous.response.value;
        transcript = previous.response.transcript;
        hasPreviousResponse = true;
        needsFulfillmentSignal = true;
      }
    }

    if ((value || transcript) && needsFulfillmentSignal) {
      this.props.onChange(
        {},
        {
          name,
          transcript,
          value,
          isFulfilled: true
        }
      );
    }

    const update = {
      hasPreviousResponse
    };

    if (value || transcript) {
      if (this.state.transcript !== transcript) {
        update.transcript = transcript;
      }
      if (this.state.value !== value) {
        update.value = value;
      }
    }

    this.setState(update);

    if (this.props.autostart) {
      this.onStartClick();
    }
  }

  onStartClick() {
    this.setState({ isRecording: true, transcript: '(Recording)' });

    (async () => {
      const which = this.props.autostart
        ? AUDIO_RECORD_INSTANT_START
        : AUDIO_RECORD_MANUAL_START;

      this.props.saveRunEvent(which, {
        prompt: this.props.prompt,
        responseId: this.props.responseId
      });

      const stream = await this.recorder.start();
      this.created_at = new Date().toISOString();

      if (this.audioNode) {
        this.audioNode.srcObject = stream;
        this.audioNode.captureStream =
          this.audioNode.captureStream || this.audioNode.mozCaptureStream;

        let recorder = new MediaRecorder(this.audioNode.captureStream());
        this.audioNode.muted = true;
        recorder.start();
        this.audioNode.play();
        // Prevent the user from pausing the player during playback
        this.audioNode.onpause = () => this.audioNode.play();
        this.audioNode.onvolumechange = () => (this.audioNode.muted = true);
      }
    })();
  }

  onStopClick() {
    this.audioNode.pause();
    this.audioNode.onpause = null;
    this.audioNode.onvolumechange = null;
    this.audioNode.muted = false;
    this.audioNode.srcObject = null;
    this.setState({ isRecording: false, transcript: '(Transcribing)' });

    (async () => {
      const mp3 = await this.recorder.stop().getMp3();
      const [buffer, blob] = mp3;
      const blobURL = URL.createObjectURL(blob);
      const file = new File(buffer, 'recording.mp3', {
        type: blob.type,
        lastModified: Date.now()
      });

      const { responseId, responseId: name, run } = this.props;

      let body = new FormData();
      body.append('name', 'audio-response');
      body.append('recording', file);
      body.append('responseId', responseId);

      if (run) {
        body.append('runId', run.id);
      }

      const { created_at } = this;
      const ended_at = new Date().toISOString();
      const isFulfillmentOverride = true;

      // This is necessary to "release" the hold made by required
      // response prompts. This will allow large audio files to
      // upload in the background, while enabling participants
      // to proceed with the scenario.
      this.props.onChange(
        {},
        {
          isFulfillmentOverride,
          created_at,
          ended_at,
          name,
          transcript: '',
          value: ''
        }
      );

      const { s3Location: value, transcript } = await (await fetch(
        '/api/media/audio',
        {
          method: 'POST',
          body
        }
      )).json();

      const which = this.props.autostart
        ? AUDIO_RECORD_INSTANT_STOP
        : AUDIO_RECORD_MANUAL_STOP;

      this.props.saveRunEvent(which, {
        prompt: this.props.prompt,
        responseId: this.props.responseId,
        transcript
      });

      this.setState(prevState => {
        if (prevState.blobURL) {
          URL.revokeObjectURL(prevState.blobURL);
        }
        return { blobURL, transcript, value };
      });

      // This will have the actual transcript of the response
      // which will override the dummy response that was
      // sent prior to uploading the audio for transcription.
      this.props.onChange(
        {},
        {
          created_at,
          ended_at,
          name,
          transcript,
          value
        }
      );
    })();
  }

  onFocus() {
    if (!this.created_at) {
      this.created_at = new Date().toISOString();
    }
  }

  onChange(event, { name, value }) {
    const transcript = '';
    const { created_at } = this;
    this.props.onChange(event, {
      created_at,
      ended_at: new Date().toISOString(),
      name,
      transcript,
      value
    });

    this.setState({ transcript, value });
  }

  innerRef(node) {
    if (node && !this.audioNode) {
      this.audioNode = node;
    }
  }

  render() {
    const {
      isRecording,
      blobURL,
      hasPreviousResponse,
      transcript,
      value
    } = this.state;
    const { prompt, responseId, run } = this.props;

    const { innerRef, onChange, onFocus, onStartClick, onStopClick } = this;
    const isFulfilled = blobURL || value || transcript ? true : false;
    const src =
      blobURL || value ? Media.fileToMediaURL(blobURL || value) : null;

    const instructions = isRecording
      ? 'Click the microphone to stop recording.'
      : 'Click the microphone to start recording';

    const audioSrc = src ? { src } : {};
    const eventContext = {
      ...audioSrc,
      prompt: this.props.prompt,
      responseId: this.props.responseId
    };

    const onAudioPlayerPlayOrPause = event => {
      // Since we use the AudioPlayer(audio) element
      // as a "meter" during recording, calling "play"
      // on the element will cause this event handler
      // to be called. We don't want to save a "play start"
      // event after "record start", but before "record stop".
      if (!isRecording) {
        const which =
          event.type === 'play'
            ? AUDIO_PLAYBACK_MANUAL_PLAY
            : AUDIO_PLAYBACK_MANUAL_PAUSE;

        this.props.saveRunEvent(which, eventContext);
      }
    };

    const audioProps = {
      controlsList: 'nodownload',
      controls: true,
      onPlay: onAudioPlayerPlayOrPause,
      onPause: onAudioPlayerPlayOrPause,
      ...audioSrc
    };

    return IS_AUDIO_RECORDING_SUPPORTED ? (
      <Fragment>
        <Grid>
          {!prompt ? (
            <Grid.Row className="ar__instructions">
              <Grid.Column tabIndex="0">{instructions}</Grid.Column>
            </Grid.Row>
          ) : null}
          <Grid.Row columns={2}>
            <Grid.Column width={3}>
              {!isRecording ? (
                <Button
                  aria-label="Start recording"
                  className="ar__button"
                  onClick={onStartClick}
                >
                  <Icon.Group size="big">
                    <Icon size="large" name="circle outline" />
                    <Icon name="microphone" />
                    <Icon corner="top right" color="red" name="circle" />
                  </Icon.Group>
                </Button>
              ) : (
                <Button
                  aria-label="Stop recording"
                  className="ar__button"
                  onClick={onStopClick}
                >
                  <Icon.Group size="big">
                    <Icon size="large" loading name="circle notch" />
                    <Icon name="microphone" />
                    <Icon
                      className="blink"
                      corner="top right"
                      color="red"
                      name="circle"
                    />
                  </Icon.Group>
                </Button>
              )}
            </Grid.Column>
            <Grid.Column>
              <Ref innerRef={innerRef}>
                <AudioPlayer {...audioProps} />
              </Ref>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {hasPreviousResponse || isFulfilled ? (
          <Transcript
            key={Identity.key({ responseId, transcript })}
            responseId={responseId}
            run={run}
            transcript={transcript}
          />
        ) : null}
      </Fragment>
    ) : (
      <Form>
        <Form.TextArea
          autoFocus
          placeholder=""
          name={responseId}
          onFocus={onFocus}
          onChange={onChange}
        />
      </Form>
    );
  }
}

AudioRecorder.defaultProps = {
  isEmbeddedInSVG: false
};

AudioRecorder.propTypes = {
  audioNode: PropTypes.object,
  autostart: PropTypes.bool,
  getResponse: PropTypes.func,
  instructions: PropTypes.string,
  isEmbeddedInSVG: PropTypes.bool,
  isRecording: PropTypes.bool,
  onChange: PropTypes.func,
  persisted: PropTypes.object,
  prompt: PropTypes.string,
  responseId: PropTypes.string,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  transcript: PropTypes.string,
  value: PropTypes.string
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
)(AudioRecorder);
