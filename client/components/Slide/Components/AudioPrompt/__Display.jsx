import { type } from './meta';
import React, { Component, Fragment } from 'react';
import Identity from '@utils/Identity';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Icon, Segment } from '@components/UI';
import MicRecorder from 'mic-recorder-to-mp3';
import { IS_AUDIO_RECORDING_SUPPORTED } from '@utils/Media';
import PromptRequiredLabel from '../PromptRequiredLabel';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Display';

//
//
//
//
// TODO: Migrate this to use AudioRecorder component
// import AudioRecorder from './AudioRecorder';
//
//
//
//
import AudioPlayer from './AudioPlayer';
import Transcript from './Transcript';
import { getResponse } from '@actions/response';
import './AudioPrompt.css';

class Display extends Component {
  constructor(props) {
    super(props);

    const { persisted = { value: '', transcript: '' } } = this.props;

    this.state = {
      blobURL: '',
      isRecording: false,
      transcript: persisted.transcript,
      type: '',
      value: persisted.value
    };

    this.created_at = new Date().toISOString();
    this.mp3Recorder = new MicRecorder({ bitRate: 128 });

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
    let {
      getResponse,
      onResponseChange,
      persisted = {},
      responseId,
      run
    } = this.props;

    let { name = responseId, transcript = '', value = '' } = persisted;

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
      this.setState({ transcript, value });
    }
  }

  onStartClick() {
    this.setState({ isRecording: true, transcript: '(Recording)' });

    (async () => {
      await this.mp3Recorder.start();
      this.created_at = new Date().toISOString();
    })();
  }

  onStopClick() {
    this.setState({ isRecording: false, transcript: '(Transcribing)' });

    (async () => {
      const [buffer, blob] = await (await this.mp3Recorder.stop()).getMp3();
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
        return { blobURL, value, isRecording: false };
      });

      const { created_at } = this;
      const { recallId } = this.props;

      this.props.onResponseChange(
        {},
        {
          created_at,
          ended_at: new Date().toISOString(),
          name,
          recallId,
          transcript,
          type,
          value
        }
      );

      this.setState({ transcript, value });
    })();
  }

  onFocus() {
    if (!this.created_at) {
      this.created_at = new Date().toISOString();
    }
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
    const { isRecording, blobURL, transcript, value } = this.state;
    const { prompt, recallId, responseId, required, run } = this.props;
    const { onChange, onFocus } = this;
    const isFulfilled = value || blobURL || transcript ? true : false;
    const header = (
      <Fragment>
        {prompt} {required && <PromptRequiredLabel fulfilled={isFulfilled} />}
      </Fragment>
    );
    const src = isFulfilled ? blobURL || value : null;

    return IS_AUDIO_RECORDING_SUPPORTED ? (
      <Segment>
        <Header as="h3" tabIndex="0">{header}</Header>
        {recallId && <ResponseRecall run={run} recallId={recallId} />}

        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={3}>
              {!isRecording ? (
                <Button
                  aria-label="Start recording"
                  className="ar__button"
                  onClick={this.onStartClick}
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
                  onClick={this.onStopClick}
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
              <AudioPlayer src={src} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <Grid.Column className="ar__instruction">
              Click the microphone to record your response. When you&apos;re
              done, click the microphone again to stop recording.
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {isFulfilled ? (
          <Transcript
            key={Identity.key({ transcript })}
            responseId={responseId}
            run={run}
            transcript={transcript}
          />
        ) : null}
      </Segment>
    ) : (
      <Segment>
        <Header as="h3" tabIndex="0">{header}</Header>
        {recallId && <ResponseRecall run={run} recallId={recallId} />}
        <Form>
          <Form.TextArea
            name={responseId}
            placeholder="..."
            onFocus={onFocus}
            onChange={onChange}
          />
        </Form>
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
  type: PropTypes.oneOf([type]).isRequired
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
