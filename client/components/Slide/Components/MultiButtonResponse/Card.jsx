import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const MultiButtonResponseCard = () => (
    <Popup
        content="A multiple button response"
        header="Multiple Button Response"
        trigger={
            <React.Fragment>
                <Icon
                    name="hand pointer outline"
                    aria-label="Multiple Button Response"
                />
                Multiple Button Response
            </React.Fragment>
        }
    />
);

export default React.memo(MultiButtonResponseCard);
