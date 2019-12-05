import { type } from './type';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Form,
    Header,
    Icon,
    Message,
    Segment
} from 'semantic-ui-react';
import PromptRequiredLabel from '../PromptRequiredLabel';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Display';
import MicRecorder from 'mic-recorder-to-mp3';
import { detect } from 'detect-browser';
import { connect } from 'react-redux';
import { getResponse } from '@client/actions/response';
import './AudioResponse.css';

const SUPPORTED_BROWSERS = ['chrome', 'firefox'];

class Display extends Component {
    constructor(props) {
        super(props);

        const { persisted } = this.props;

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
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);

        this.browserSupported = SUPPORTED_BROWSERS.includes(detect().name);
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
            onResponseChange(
                {},
                { name, transcript, value, isFulfilled: true }
            );
            this.setState({ transcript, value });
        }
    }

    async onStart() {
        await this.mp3Recorder.start();
        this.created_at = new Date().toISOString();
        this.setState({
            isRecording: true
        });
    }

    async onStop() {
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

        const { s3Location: value } = await (await fetch('/api/media/audio', {
            method: 'POST',
            body
        })).json();

        this.setState(prevState => {
            if (prevState.blobURL) {
                URL.revokeObjectURL(prevState.blobURL);
            }
            return { blobURL, value, isRecording: false };
        });

        const { created_at } = this;
        const { recallId } = this.props;
        const transcript = '';

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
        const fulfilled = value || blobURL ? true : false;
        const header = this.browserSupported ? (
            required && <PromptRequiredLabel fulfilled={fulfilled} />
        ) : (
            <React.Fragment>
                Type your response here:{' '}
                {required && <PromptRequiredLabel fulfilled={fulfilled} />}
            </React.Fragment>
        );

        return this.browserSupported ? (
            <Segment>
                <Header as="h3">{header}</Header>
                {recallId && <ResponseRecall run={run} recallId={recallId} />}
                {!isRecording && (
                    <Button basic toggle onClick={this.onStart}>
                        <Icon
                            name="circle"
                            aria-label="Record an Audio Response"
                        />
                        {prompt}
                    </Button>
                )}
                {isRecording && (
                    <Button basic negative onClick={this.onStop}>
                        <Icon
                            name="stop circle"
                            aria-label="Record an Audio Response"
                        />
                        Done
                    </Button>
                )}

                {(blobURL || value) && (
                    <Message
                        content={
                            <React.Fragment>
                                <audio
                                    src={blobURL || `/api/media/${value}`}
                                    controls="controls"
                                />

                                <blockquote className="audiotranscript__blockquote">
                                    {transcript ||
                                        '(Transcription in progress. This may take a few minutes, depending on the length of your audio recording.)'}
                                </blockquote>
                            </React.Fragment>
                        }
                    />
                )}
            </Segment>
        ) : (
            <Segment>
                <Header as="h3">{header}</Header>
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

Display.propTypes = {
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

function mapStateToProps(state) {
    const { run } = state;
    return { run };
}

const mapDispatchToProps = dispatch => ({
    getResponse: params => dispatch(getResponse(params))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Display);
