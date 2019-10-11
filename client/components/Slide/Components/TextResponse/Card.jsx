import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const TextResponseCard = () => (
    <Popup
        content="A simple text area for users to respond"
        header="Text Response"
        trigger={
            <Icon
                name="question circle outline"
                aria-label="Text Response Component"
            />
        }
    />
);

export default React.memo(TextResponseCard);
