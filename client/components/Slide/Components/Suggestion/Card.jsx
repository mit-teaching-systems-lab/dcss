import React from 'react';
import { Popup, Icon } from '@components/UI';
import { name } from './meta';

const SuggestionCard = () => (
  <Popup
    content="Insert a suggestion that will appear in the slide."
    header={name}
    trigger={
      <React.Fragment>
        <Icon name="info circle" aria-label={name} />
        {name}
      </React.Fragment>
    }
  />
);

export default React.memo(SuggestionCard);
