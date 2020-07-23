import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import { connect } from 'react-redux';
import { Button, Form, Grid, Icon, Popup, Ref } from '@components/UI';
import MicRecorder from 'mic-recorder-to-mp3';
import Transcript from './Transcript';
import Media, { IS_AUDIO_RECORDING_SUPPORTED } from '@utils/Media';
import { getResponse } from '@actions/response';
import './AudioPrompt.css';

class AudioRecorder extends Component {
  constructor(props) {
    super(props);

    const { transcript = '', value = '' } = this.props;

    this.state = {
      blobURL: '',
      isRecording: false,
      transcript,
      value
    };

    this.created_at = new Date().toISOString();
    this.recorder = new MicRecorder({ bitRate: 128 });
    this.innerRef = this.innerRef.bind(this);
    this.audioNode = null;

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onStartClick = this.onStartClick.bind(this);
    this.onStopClick = this.onStopClick.bind(this);
  }

  get isScenarioRun() {
    return location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }

    if (this.props.autostart) {
      this.onStartClick();
    }

    let {
      getResponse,
      onChange,
      responseId,
      run,
      transcript,
      value
    } = this.props;

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
      onChange({}, { name, transcript, value, isFulfilled: true });
      this.setState({ transcript, value });
    }
  }

  onStartClick() {
    this.setState({ isRecording: true, transcript: '(Recording)' });

    (async () => {
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
      const [buffer, blob] = await this.recorder.stop().getMp3();
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

      const { s3Location: value, transcript } = await (await fetch(
        '/api/media/audio',
        {
          method: 'POST',
          body
        }
      )).json();

      this.setState(prevState => {
        if (prevState.blobURL) {
          URL.revokeObjectURL(prevState.blobURL);
        }
        return { blobURL, transcript, value };
      });

      const { created_at } = this;

      this.props.onChange(
        {},
        {
          created_at,
          ended_at: new Date().toISOString(),
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
    const { isRecording, blobURL, transcript, value } = this.state;
    const { responseId, run } = this.props;

    const { innerRef, onChange, onFocus, onStartClick, onStopClick } = this;
    const isFulfilled = value || blobURL || transcript ? true : false;
    const src = isFulfilled ? Media.fileToMediaURL(blobURL || value) : null;

    const instructions = isRecording
      ? 'Click the microphone to stop recording.'
      : "Click the microphone to record your response. When you're done, click the microphone again to stop recording.";

    const audioSrc = src ? { src } : {};
    const audioProps = {
      controlslist: 'nodownload',
      controls: true,
      ...audioSrc
    };

    return IS_AUDIO_RECORDING_SUPPORTED ? (
      <Fragment>
        <Grid>
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
                <audio {...audioProps} />
              </Ref>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>{instructions}</Grid.Column>
          </Grid.Row>
        </Grid>
        {isFulfilled ? (
          <Transcript
            key={hash({ transcript })}
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
          placeholder="..."
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
  autostart: PropTypes.bool,
  getResponse: PropTypes.func,
  isEmbeddedInSVG: PropTypes.bool,
  isRecording: PropTypes.bool,
  onChange: PropTypes.func,
  responseId: PropTypes.string,
  run: PropTypes.object,
  instructions: PropTypes.string,
  transcript: PropTypes.string,
  value: PropTypes.string
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
)(AudioRecorder);
