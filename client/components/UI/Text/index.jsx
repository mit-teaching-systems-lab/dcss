import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export class Text extends Component {
  render() {
    const {
      children = null,
      style = {},
      title = '',
      ...rest
    } = this.props;

    const classNames = ['ui'];

    Object.entries(rest).forEach(([key, value]) => {
      console.log(key, value);
      if (value) {
        classNames.push(key);
      }
    });

    classNames.push('text');

    const className = classNames.join(' ');

    return (
      <span aria-label={title} className={className} title={title} style={style}>
        {children}
      </span>
    );
  }
}

Text.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  style: PropTypes.object,
  title: PropTypes.string
};
