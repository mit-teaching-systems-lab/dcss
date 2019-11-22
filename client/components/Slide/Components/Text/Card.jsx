import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const TextCard = () => (
    <Popup
        content="A rich text display area, used for titles, text, images, video and many other things."
        header="Text"
        trigger={
            <React.Fragment>
                <Icon name="edit" aria-label="Rich Text" />
                Rich Text
            </React.Fragment>
        }
    />
);

export default React.memo(TextCard);
