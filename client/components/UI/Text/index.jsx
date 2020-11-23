import React from 'react';
import PropTypes from 'prop-types';
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
