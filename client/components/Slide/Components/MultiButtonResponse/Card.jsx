import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { name } from './meta';

const MultiButtonResponseCard = () => (
  <Popup
    content="A multiple button response"
    header={name}
    trigger={
      <React.Fragment>
        <Icon name="hand pointer outline" aria-label={name} />
        {name}
      </React.Fragment>
    }
  />
);

export default React.memo(MultiButtonResponseCard);
