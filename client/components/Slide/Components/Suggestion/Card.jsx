import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const SuggestionCard = () => (
    <Popup
        content="Insert a suggestion that will appear in the slide."
        header="Suggestion"
        trigger={
            <React.Fragment>
                <Icon name="lightbulb outline" aria-label="Suggestion" />
                Suggestion
            </React.Fragment>
        }
    />
);

export default React.memo(SuggestionCard);
