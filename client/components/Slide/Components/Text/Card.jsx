import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const TextCard = () => (
    <Popup
        content="A rich text display area, used for titles, text, and many other things."
        header="Text"
        trigger={<Icon name="file text" aria-label="Text Component" />}
    />
);

export default React.memo(TextCard);
