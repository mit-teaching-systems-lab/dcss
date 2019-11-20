import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const ResponseRecallCard = () => (
    <Popup
        content="Embed a previously entered user response"
        header="Response Recall"
        trigger={
            <React.Fragment>
                <Icon
                    name="comment alternate outline"
                    aria-label="Response Recall"
                />
                Response Recall
            </React.Fragment>
        }
    />
);

export default React.memo(ResponseRecallCard);
