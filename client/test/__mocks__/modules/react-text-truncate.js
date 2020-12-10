import React from 'react';
import PropTypes from 'prop-types';

function Truncate(props) {
  let element = props.element || 'span';
  let children = props.children || props.text || '';
  return React.createElement(element, null, `${children}${props.truncateText}`);
}

Truncate.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  element: PropTypes.string,
  id: PropTypes.node,
  lines: PropTypes.number,
  truncateText: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  textTruncateChild: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default Truncate;
