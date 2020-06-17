import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { detect } from 'detect-browser';

const IS_ANDROID = detect()
  .os.toLowerCase()
  .includes('android');

const ClickableTableCell = props => {
  const { className, display, href } = props;
  const onClick =
    props.onClick || (IS_ANDROID ? () => (location.href = href) : null);

  const link = href && display ? <Link to={href}>{display}</Link> : display;
  return (
    <Table.Cell
      style={{ cursor: 'pointer' }}
      className={className}
      onClick={onClick}
      onTouchStart={onClick}
    >
      {link}
    </Table.Cell>
  );
};

ClickableTableCell.propTypes = {
  className: PropTypes.string,
  display: PropTypes.node,
  href: PropTypes.string,
  onClick: PropTypes.func
};

export default ClickableTableCell;
