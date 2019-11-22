import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const ResponseRecallCard = () => (
    <Popup
        content="Embed a previously entered participant response"
        header="Embed Previous Response"
        trigger={
            <React.Fragment>
                <Icon
                    name="comment alternate outline"
                    aria-label="Embed Previous Response"
                />
                Embed Previous Response
            </React.Fragment>
        }
    />
);

export default React.memo(ResponseRecallCard);
