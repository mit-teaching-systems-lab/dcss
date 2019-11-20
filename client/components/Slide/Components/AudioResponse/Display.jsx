import { type } from './type';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Label, Icon } from 'semantic-ui-react';
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

        this.mp3Recorder = new MicRecorder({ bitRate: 128 });

        this.onClick = this.onClick.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);

        this.browserSupported = SUPPORTED_BROWSERS.includes(detect().name);
    }

    onClick() {
        this.setState(prevState => ({ isRecording: !prevState.isRecording }));
    }

    async onStart() {
        await this.mp3Recorder.start();
        this.setState({ isRecording: true });
    }

    async onStop() {
        const [buffer, blob] = await (await this.mp3Recorder.stop()).getMp3();
        const blobURL = URL.createObjectURL(blob);

        const file = new File(buffer, 'recording.mp3', {
            type: blob.type,
            lastModified: Date.now()
        });

        let data = new FormData();
        data.append('name', 'audio-response');
        data.append('recording', file);
        data.append('responseId', this.props.responseId);

        if (this.props.run) {
            data.append('runId', this.props.run.id);
        }

        const { s3Location } = await (await fetch('/api/media/audio', {
            method: 'POST',
            body: data
        })).json();

        this.setState(prevState => {
            if (prevState.blobURL) {
                URL.revokeObjectURL(prevState.blobURL);
            }
            return { blobURL, isRecording: false };
        });

        this.props.onResponseChange(
            {},
            { name: this.props.responseId, value: s3Location, type: 'audio' }
        );
    }

    render() {
        const { isRecording } = this.state;
        const { prompt } = this.props;
        return (
            (this.browserSupported && (
                <React.Fragment>
                    <Label>
                        <p>{prompt}</p>
                        {!isRecording && (
                            <Button
                                basic
                                color="black"
                                toggle
                                onClick={this.onStart}
                            >
                                <Icon
                                    name="circle"
                                    aria-label="Record an Audio Response"
                                />
                                Record Response
                            </Button>
                        )}
                        {isRecording && (
                            <Button basic negative onClick={this.onStop}>
                                <Icon
                                    name="stop circle"
                                    aria-label="Record an Audio Response"
                                />
                                Stop Recording
                            </Button>
                        )}
                    </Label>

                    <audio src={this.state.blobURL} controls="controls" />
                </React.Fragment>
            )) || <p>Please switch to Chrome or Firefox to record audio.</p>
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
