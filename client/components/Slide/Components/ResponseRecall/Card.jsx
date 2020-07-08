import React from 'react';
import { Icon } from '@components/UI';
import { name } from './meta';

const Card = () => (
  <React.Fragment>
    <Icon name="comment alternate outline" aria-label={name} />
    {name}
  </React.Fragment>
);

export default React.memo(Card);
