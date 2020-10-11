import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

let rootNode;

class ModalAccessible extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTrap: false
    };

    this.mountTrap = this.mountTrap.bind(this);
    this.unmountTrap = this.unmountTrap.bind(this);
  }
  componentDidMount() {
    if (!rootNode) {
      rootNode = document.getElementById('root');
    }

    if (rootNode) {
      rootNode.setAttribute('aria-hidden', true);
    }

    if (this.props.open && !this.state.activeTrap) {
      this.mountTrap();
    }

    if (!this.props.open && this.state.activeTrap) {
      this.unmountTrap();
    }
  }
  componentWillUnmount() {
    if (!rootNode) {
      rootNode = document.getElementById('root');
    }

    if (rootNode) {
      rootNode.setAttribute('aria-hidden', false);
    }
  }
  mountTrap() {
    this.setState({ activeTrap: true });
  }
  unmountTrap() {
    this.setState({ activeTrap: false });
  }
  render() {
    const { activeTrap } = this.state;
    const { children } = this.props;

    return activeTrap ? (
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.unmountTrap
        }}
      >
        {children}
      </FocusTrap>
    ) : null;
  }
}

ModalAccessible.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default ModalAccessible;
