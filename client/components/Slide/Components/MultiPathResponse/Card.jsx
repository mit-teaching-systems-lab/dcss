import React from 'react';
import { Icon } from '@components/UI';
import { name } from './meta';

const Card = () => (
  <React.Fragment>
    <Icon name="fork" rotated="clockwise" aria-label={name} />
    <span className="ser__component-name">{name}</span>
  </React.Fragment>
);

export default React.memo(Card);
