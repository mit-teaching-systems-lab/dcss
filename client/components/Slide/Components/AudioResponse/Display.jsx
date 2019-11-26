import { type } from './type';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Icon, Segment } from 'semantic-ui-react';
import PromptRequiredLabel from '../PromptRequiredLabel';
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

        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
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

    onFocus() {
        if (!this.created_at) {
            this.created_at = new Date().toISOString();
        }
    }

    onChange(event, data) {
        const { created_at } = this;
        this.props.onResponseChange(event, {
            ...data,
            created_at,
            ended_at: new Date().toISOString(),
            type
        });
    }

    render() {
        const { isRecording, blobURL } = this.state;
        const { prompt, responseId, required } = this.props;
        const { onChange, onFocus } = this;
        const fulfilled = blobURL ? true : false;
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
                {this.state.blobURL && (
                    <audio src={this.state.blobURL} controls="controls" />
                )}

                {header}
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

function mapStateToProps(state) {
    const { run } = state.run;
    return { run };
}

Display.propTypes = {
    isRecording: PropTypes.bool,
    onResponseChange: PropTypes.func,
    placeholder: PropTypes.string,
    prompt: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    run: PropTypes.object,
    type: PropTypes.oneOf([type]).isRequired
};

export default connect(mapStateToProps)(React.memo(Display));
