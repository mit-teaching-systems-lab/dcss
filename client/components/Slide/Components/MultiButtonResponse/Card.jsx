import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const MultiButtonResponseCard = () => (
    <Popup
        content="A multiple button response"
        header="Multiple Button Prompt"
        trigger={
            <React.Fragment>
                <Icon
                    name="hand pointer outline"
                    aria-label="Multiple Button Prompt"
                />
                Multiple Button Prompt
            </React.Fragment>
        }
    />
);

export default React.memo(MultiButtonResponseCard);
