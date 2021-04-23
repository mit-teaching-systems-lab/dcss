import React from 'react';
import { Icon } from '@components/UI';
import { name } from './meta';

const CardIcon = <Icon name="conversation" aria-label={name} />;
const Card = () => (
  <React.Fragment>
    {CardIcon}
    <span className="ser__component-name">{name}</span>
  </React.Fragment>
);

const memo = React.memo(Card);
memo.Icon = CardIcon;
export default memo;
