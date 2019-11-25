import { type } from './type';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon, Segment, TextArea } from 'semantic-ui-react';
import MicRecorder from 'mic-recorder-to-mp3';
import { detect } from 'detect-browser';
import { connect } from 'react-redux';

import './AudioResponse.css';

const SUPPORTED_BROWSERS = ['chrome', 'firefox'];

class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRecording: false,
            type: '',
            blobURL: ''
        };

        this.created_at = new Date().toISOString();
        this.mp3Recorder = new MicRecorder({ bitRate: 128 });

        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);

        this.browserSupported = SUPPORTED_BROWSERS.includes(detect().name);
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
            return { blobURL, isRecording: false };
        });

        const { created_at } = this;

        // This saves every recording that the user creates
        this.props.onResponseChange(
            {},
            {
                created_at,
                ended_at: new Date().toISOString(),
                name,
                type,
                value
            }
        );
    }

    render() {
        const { isRecording } = this.state;
        const { prompt, responseId, onResponseChange } = this.props;
        return this.browserSupported ? (
            <React.Fragment>
                <Segment>
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
                </Segment>

                {this.state.blobURL && (
                    <audio src={this.state.blobURL} controls="controls" />
                )}
            </React.Fragment>
        ) : (
            <Segment>
                <Form>
                    <Form.Field>
                        <TextArea
                            name={responseId}
                            placeholder="Type your response here"
                            onChange={onResponseChange}
                        />
                    </Form.Field>
                </Form>
            </Segment>
        );
    }
}

function mapStateToProps(state) {
    const { run } = state.run;
    return { run };
}

Display.propTypes = {
    prompt: PropTypes.string,
    placeholder: PropTypes.string,
    isRecording: PropTypes.bool,
    onResponseChange: PropTypes.func,
    type: PropTypes.oneOf([type]).isRequired,
    responseId: PropTypes.string,
    run: PropTypes.object
};

export default connect(mapStateToProps)(React.memo(Display));
