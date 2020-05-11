import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { name } from './meta';

const ResponseRecallCard = () => (
  <Popup
    content="Embed a previously entered participant response"
    header={name}
    trigger={
      <React.Fragment>
        <Icon name="comment alternate outline" aria-label={name} />
        {name}
      </React.Fragment>
    }
  />
);

export default React.memo(ResponseRecallCard);
