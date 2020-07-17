import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

let rootNode;

class ModalAccessible extends Component {
  componentDidMount() {
    if (!rootNode) {
      rootNode = document.getElementById('root');
    }
    rootNode.setAttribute('aria-hidden', true);
  }
  componentWillUnmount() {
    if (!rootNode) {
      rootNode = document.getElementById('root');
    }
    rootNode.setAttribute('aria-hidden', false);
  }
  render() {
    const { children, open } = this.props;
    return open ? <FocusTrap>{children}</FocusTrap> : null;
  }
}

ModalAccessible.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default ModalAccessible;
