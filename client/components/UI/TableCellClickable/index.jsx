import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Popup, Table } from 'semantic-ui-react';
import { IS_ANDROID } from '@utils/constants';

const ClickableTableCell = props => {
  const { children, content, href, popup, ...rest } = props;
  const onClick =
    props.onClick || (IS_ANDROID ? () => (location.href = href) : null);

  const hasChildren = children && children.length !== 0;
  const child = hasChildren ? children : content;

  const role = 'button';
  const style = { cursor: 'pointer' };
  const link = href && child ? <Link to={href}>{child}</Link> : child;

  const cell = (
    <Table.Cell
      {...rest}
      role={role}
      style={style}
      onClick={onClick}
      onTouchStart={onClick}
    >
      {link}
    </Table.Cell>
  );

  return popup ? (
    <Popup inverted size="tiny" content={popup} trigger={cell} />
  ) : (
    cell
  );
};

ClickableTableCell.propTypes = {
  as: PropTypes.elementType,
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  collapsing: PropTypes.bool,
  content: PropTypes.any,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  icon: PropTypes.any,
  negative: PropTypes.bool,
  positive: PropTypes.bool,
  selectable: PropTypes.bool,
  singleLine: PropTypes.bool,
  textAlign: PropTypes.string,
  verticalAlign: PropTypes.string,
  warning: PropTypes.bool,
  width: PropTypes.number,
  href: PropTypes.string,
  popup: PropTypes.string,
  onClick: PropTypes.func
};

export default ClickableTableCell;
