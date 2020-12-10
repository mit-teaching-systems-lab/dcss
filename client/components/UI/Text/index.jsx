import React from 'react';
import PropTypes from 'prop-types';
import TextTruncate from 'react-text-truncate';
import './Text.css';

export function Text({
  children = null,
  label = '',
  size = 'medium',
  style = {},
  title = '',
  ...rest
}) {
  const classNames = ['ui'];
  const props = {};
  Object.entries(rest).forEach(([key, value]) => {
    if (typeof value === 'boolean' && value) {
      classNames.push(key);
    } else {
      props[key] = value;
    }
  });

  classNames.push(size, 'text');

  const className = classNames.join(' ');

  if (title) {
    props.title = title;
    props['aria-label'] = title;
  }

  if (label) {
    props['aria-label'] = label;
  }

  if (style) {
    props.style = style;
  }

  return (
    <span className={className} {...props}>
      {children}
    </span>
  );
}

Text.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  label: PropTypes.string,
  size: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string
};

export function Truncate(props) {
  const {
    children,
    element = 'p',
    id = '',
    lines = 1,
    textTruncateChild = null,
    truncateText = '…'
  } = props;

  let text = props.text && !children ? props.text : children;

  if (!text) {
    text = '';
  }

  const truncateProps = {
    line: lines,
    element,
    id,
    text,
    textTruncateChild,
    truncateText
  };

  return <TextTruncate {...truncateProps} />;
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
