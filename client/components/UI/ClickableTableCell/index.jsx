import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { detect } from 'detect-browser';

const IS_ANDROID = detect()
  .os.toLowerCase()
  .includes('android');

const ClickableTableCell = props => {
  const { children, content, href, ...rest } = props;
  const onClick =
    props.onClick || (IS_ANDROID ? () => (location.href = href) : null);

  const hasChildren = children && children.length !== 0;
  const child = hasChildren
    ? children
    : content;

  const link = href && child
    ? <Link to={href}>{child}</Link>
    : child;

  return (
    <Table.Cell
      {...rest}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
      onTouchStart={onClick}
    >
      {link}
    </Table.Cell>
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
  onClick: PropTypes.func
};

export default ClickableTableCell;
