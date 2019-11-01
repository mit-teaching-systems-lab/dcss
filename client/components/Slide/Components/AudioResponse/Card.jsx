import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const AudioResponseCard = () => (
    <Popup
        content="An audio recorder for users to record responses."
        header="Audio Response"
        trigger={
            <React.Fragment>
                <Icon name="microphone" aria-label="Audio Response" />
                Audio Response
            </React.Fragment>
        }
    />
);

export default React.memo(AudioResponseCard);
