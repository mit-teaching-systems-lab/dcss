import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const TextResponseCard = () => (
    <Popup
        content="A checkbox response"
        header="Checkbox Response"
        trigger={
            <React.Fragment>
                <Icon
                    name="check square outline"
                    aria-label="Checkbox Response"
                />
                Checkbox Response
            </React.Fragment>
        }
    />
);

export default React.memo(TextResponseCard);
