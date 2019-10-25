import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Label, Icon } from 'semantic-ui-react';

import './AudioResponse.css';

const Display = ({ prompt, isRecording = false, onClickResponse }) => {
    return (
        <React.Fragment>
            <Label>
                <p>{prompt}</p>
                {!isRecording && (
                    <Button
                        basic
                        color="black"
                        toggle
                        onClick={onClickResponse}
                    >
                        <Icon
                            name="circle"
                            aria-label="Record an Audio Response"
                        />
                        Record Response
                    </Button>
                )}
                {isRecording && (
                    <Button basic negative onClick={onClickResponse}>
                        <Icon
                            name="stop circle"
                            aria-label="Record an Audio Response"
                        />
                        Stop Recording
                    </Button>
                )}
            </Label>
        </React.Fragment>
    );
};

Display.propTypes = {
    prompt: PropTypes.string,
    placeholder: PropTypes.string,
    isRecording: PropTypes.bool,
    onClickResponse: PropTypes.func,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
