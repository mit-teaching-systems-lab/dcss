import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const header = 'Rich Text';
const TextCard = () => (
  <Popup
    content="A rich text display area, used for titles, text, images, video and many other things."
    header={header}
    trigger={
      <React.Fragment>
        <Icon name="edit" aria-label={header} />
        {header}
      </React.Fragment>
    }
  />
);

export default React.memo(TextCard);
