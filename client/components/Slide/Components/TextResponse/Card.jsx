import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const TextResponseCard = () => (
    <Popup
        content="A simple text input prompt"
        header="Text Input Prompt"
        trigger={
            <React.Fragment>
                <Icon name="keyboard" aria-label="Text Input Prompt" />
                Text Input Prompt
            </React.Fragment>
        }
    />
);

export default React.memo(TextResponseCard);
