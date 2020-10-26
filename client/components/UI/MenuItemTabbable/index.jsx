import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Popup } from 'semantic-ui-react';
import Events from '@utils/Events';

const noOp = () => {};

const MenuItemTabbable = ({ children, popup, ...props }) => {
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

  const nested = Array.isArray(children)
    ? (children.length && children || null)
    : children;

  const menuItem = (
    <Menu.Item {...menuItemProps}>
      {nested || null}
    </Menu.Item>
  );

  return popup ? (
    <Popup
      inverted
      size="tiny"
      content={popup}
      trigger={menuItem}
    />
  ) : (
    menuItem
  );
};

MenuItemTabbable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  onClick: PropTypes.func,
  onKeyUp: PropTypes.func,
  popup: PropTypes.string,
  tabIndex: PropTypes.any
};

export default MenuItemTabbable;
