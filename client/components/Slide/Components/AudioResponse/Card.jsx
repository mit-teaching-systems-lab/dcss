import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const AudioResponseCard = () => (
    <Popup
        content="An audio recorder for users to record responses."
        header="Audio Response"
        trigger={
            <Icon name="microphone" aria-label="Audio Response Component" />
        }
    />
);

export default React.memo(AudioResponseCard);
