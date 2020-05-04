import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { name } from './meta';

const TextResponseCard = () => (
    <Popup
        content="A simple text input prompt"
        header={name}
        trigger={
            <React.Fragment>
                <Icon name="keyboard" aria-label={name} />
                {name}
            </React.Fragment>
        }
    />
);

export default React.memo(TextResponseCard);
