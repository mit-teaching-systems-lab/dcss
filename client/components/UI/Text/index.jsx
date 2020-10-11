import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Text extends Component {
  render() {
    const { children = null, style = {}, title = '', ...rest } = this.props;

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
}

Text.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  style: PropTypes.object,
  title: PropTypes.string
};
