import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const SuggestionCard = () => (
    <Popup
        content="Insert a suggestion that will appear in the slide."
        header="Participant Suggestion"
        trigger={
            <React.Fragment>
                <Icon name="info circle" aria-label="Participant Suggestion" />
                Participant Suggestion
            </React.Fragment>
        }
    />
);

export default React.memo(SuggestionCard);
