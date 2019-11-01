import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const TextResponseCard = () => (
    <Popup
        content="A simple text area for users to respond"
        header="Text Response"
        trigger={
            <React.Fragment>
                <Icon name="keyboard" aria-label="Text Response" />
                Text Response
            </React.Fragment>
        }
    />
);

export default React.memo(TextResponseCard);
