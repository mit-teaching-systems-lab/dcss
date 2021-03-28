import React from 'react';
import { Icon } from '@components/UI';
import { name } from './meta';

const Card = () => (
  <React.Fragment>
    <Icon className="pen fancy" aria-label={name} />
    <span className="ser__component-name">{name}</span>
  </React.Fragment>
);

export default React.memo(Card);
