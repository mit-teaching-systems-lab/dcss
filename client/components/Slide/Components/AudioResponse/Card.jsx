import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { name } from './meta';

const AudioResponseCard = () => (
  <Popup
    content="An audio recorder for users to record responses."
    header={name}
    trigger={
      <React.Fragment>
        <Icon name="microphone" aria-label={name} />
        {name}
      </React.Fragment>
    }
  />
);

export default React.memo(AudioResponseCard);
