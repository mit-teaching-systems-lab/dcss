import React from 'react';
import PropTypes from 'prop-types';

export default class extends React.Component {
  render() {
    const { className, onSortableChange, children } = this.props;
    return (
      <tbody className={className} onChange={onSortableChange}>
        {children}
      </tbody>
    );
  }
  static get propTypes() {
    return {
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
      ]),
      className: PropTypes.string,
      onSortableChange: PropTypes.func
    };
  }
}
