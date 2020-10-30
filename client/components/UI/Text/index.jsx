import React from 'react';
import PropTypes from 'prop-types';
import './Text.css';

export function Text({ children = null, style = {}, title = '', ...rest }) {
  const classNames = ['ui'];
  const props = {};
  Object.entries(rest).forEach(([key, value]) => {
    if (typeof value === 'boolean' && value) {
      classNames.push(key);
    } else {
      props[key] = value;
    }
  });

  classNames.push('text');

  const className = classNames.join(' ');

  return (
    <span
      aria-label={title}
      className={className}
      title={title}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
}

Text.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  style: PropTypes.object,
  title: PropTypes.string
};
