import React from 'react';
import { Icon } from '@components/UI';
import { name } from './meta';

const Card = () => (
  <React.Fragment>
    <Icon name="chat" aria-label={name} />
    {name}
  </React.Fragment>
);

export default React.memo(Card);
