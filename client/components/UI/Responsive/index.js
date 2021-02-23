// From semantic-ui-react@1.3.1
//
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { instance as eventStack } from '@semantic-ui-react/event-stack';
import getElementType from './getElementType';
import getUnhandledProps from './getUnhandledProps';
import isBrowser from './isBrowser';
import isVisible from './isVisible';

const invoke = (object, method, ...args) =>
  typeof object[method] === 'function' ? object[method](...args) : undefined;

export class Responsive extends Component {
  state = {
    visible: true
  };

  static getDerivedStateFromProps(props) {
    const width = props.getWidth();
    const visible = isVisible(width, props);

    return { visible };
  }

  componentDidMount() {
    const { fireOnMount } = this.props;
    eventStack.sub('resize', this.onResize, { target: 'window' });
    if (fireOnMount) {
      this.update();
    }
  }

  componentWillUnmount() {
    eventStack.unsub('resize', this.onResize, { target: 'window' });
    cancelAnimationFrame(this.frameId);
  }

  onResize = e => {
    if (this.ticking) {
      return;
    }

    this.ticking = true;
    this.frameId = requestAnimationFrame(() => this.update(e));
  };

  update = e => {
    this.ticking = false;

    const { visible } = this.state;
    const width = this.props.getWidth();
    const nextVisible = isVisible(width, this.props);

    if (visible !== nextVisible) {
      this.setState({ visible: nextVisible });
    }

    if (this.props.onResize) {
      this.props.onResize(e, { ...this.props, width });
    }
  };

  render() {
    const { children } = this.props;
    const { visible } = this.state;

    const ElementType = getElementType(Responsive, this.props);
    const rest = getUnhandledProps(Responsive, this.props);

    if (visible) {
      return <ElementType {...rest}>{children}</ElementType>;
    }

    return null;
  }
}

Responsive.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node,
  fireOnMount: PropTypes.bool,
  getWidth: PropTypes.func,
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onResize: PropTypes.func
};

Responsive.defaultProps = {
  getWidth: () => (isBrowser() ? window.innerWidth : 0)
};
