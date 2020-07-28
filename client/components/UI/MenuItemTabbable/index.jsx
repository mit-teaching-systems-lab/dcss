import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';
import Events from '@utils/Events';

const noOp = () => {};

const MenuItemTabbable = ({ children, ...props }) => {
  const onClick = props.onClick || noOp;
  const onAnyKeyUp = props.onKeyUp || noOp;
  const onKeyUp = (event, data) => {
    onAnyKeyUp(event, data);
    if (onClick !== noOp) {
      Events.onKeyUp(event, data, onClick);
    }
  };

  const tabIndex = props.tabIndex || 0;
  const menuItemProps = {
    ...props,
    onKeyUp,
    tabIndex
  };

  return (
    <Menu.Item tabIndex="0" {...menuItemProps}>
      {children}
    </Menu.Item>
  );
};

MenuItemTabbable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  onClick: PropTypes.func,
  onKeyUp: PropTypes.func,
  tabIndex: PropTypes.any
};

export default MenuItemTabbable;
