import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toast from './Toast';
import { store } from './notifier';
import Identity from '@utils/Identity';
import './Toast.css';

const closeAnimations = {
  'top-right': 'fly left',
  'top-center': 'fly down',
  'top-left': 'fly right',
  'bottom-right': 'fly left',
  'bottom-center': 'fly up',
  'bottom-left': 'fly right'
};

class ToastContainer extends Component {
  static propTypes = {
    animation: PropTypes.string,
    className: PropTypes.string,
    position: PropTypes.oneOf(Object.keys(closeAnimations))
  };

  static defaultProps = {
    animation: null,
    className: '',
    position: 'top-right'
  };

  state = {
    toasts: []
  };

  componentDidMount() {
    store.subscribe(this.updateToasts);
  }

  componentWillUnmount() {
    store.unsubscribe(this.updateToasts);
  }

  onClose = id => {
    const toast = this.state.toasts.find(value => value.id === id);

    if (!toast) {
      return;
    }

    store.remove(toast);

    if (toast.onClose) {
      toast.onClose();
    }
  };

  updateToasts = toasts => {
    this.setState({
      toasts
    });
  };

  render() {
    const { animation: containerAnimation, position, className } = this.props;
    const { toasts } = this.state;
    const { onClose } = this;
    return toasts.length ? (
      <div className={`ui-alerts ${position} ${className}`}>
        {toasts.map(toast => {
          const {
            animation,
            className = '',
            color,
            description = '',
            icon,
            id,
            list,
            onClick,
            onDismiss,
            size,
            time,
            title = '',
            type = ''
          } = toast;

          const key = Identity.key(toast);
          const openAnimation = animation || containerAnimation || 'pulse';
          const closeAnimation = closeAnimations[position];
          const toastProps = {
            className,
            closeAnimation,
            color,
            description,
            icon,
            id,
            key,
            list,
            onClick,
            onClose,
            onDismiss,
            openAnimation,
            size,
            time,
            title,
            type
          };

          return <Toast {...toastProps} />;
        })}
      </div>
    ) : null;
  }
}

export default ToastContainer;
