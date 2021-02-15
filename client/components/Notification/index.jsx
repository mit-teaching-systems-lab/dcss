import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import objectPath from 'object-path';
import { ToastContainer, notifier } from '@components/Toast';
import { getInvites } from '@actions/invite';
import { Button, Header, Modal } from '@components/UI';
import withSocket, {
  CREATE_USER_CHANNEL,
  NOTIFICATION
} from '@hoc/withSocket';
import Identity from '@utils/Identity';

import './Notification.css';

const cache = new Set();
const noOp = () => {};
const checkNotificationRules = (state, rules) => {
  return Object.entries(rules).every(([key, value]) => {
    return objectPath.get(state, key) === value;
  });
};

const createHTML = html => ({ __html: html });

const notify = (configuration) => {
  const {
    className = 'n__container',
    color,
    icon = '',
    message = '',
    title = '',
    size = 'large',
    style = {},
    time = 2000,
    type = '',
    onClick = noOp,
    onClose = noOp,
    onDismiss = noOp,
  } = configuration;

  const description = message;
  const props = {
    className,
    title,
    description,
    icon,
    size,
    style,
    time,
    type,
  };

  if (color) {
    props.color = color;
    props.type = undefined;
  }

  if (type === 'warn') {
    props.color = 'orange';
    props.type = undefined;
  }

  const key = Identity.key(props);

  if (!cache.has(key)) {
    cache.add(key);
    const wrappedOnClose = () => {
      cache.delete(key);
      onClose();
    };
    notifier(
      props,
      wrappedOnClose,
      onClick,
      onDismiss
    );
  }
}

notify.queue = notifier.store;

export {
  checkNotificationRules,
  createHTML,
  notify,
};



class Notification extends Component {
  onMessage = notification => {
    const canShowNotification = checkNotificationRules(
      this.props.state,
      notification.rules
    );

    if (!canShowNotification) {
      return;
    }

    // if (notification.type === 'invite') {

    //   let className = notification.props.className || '';
    //   className += `n__container`;

    //   notification.props.className = className.trim();

    //   if (notification.props.html) {
    //     const onClick = event => {
    //       if (event.target.tagName === 'BUTTON') {
    //         if (notifier.store.data.length) {
    //           notifier.store.remove(notifier.store.data[0]);
    //         }

    //         this.props.history.push(event.target.dataset.href, {
    //           redirect: window.location.href
    //         });
    //       }
    //     };

    //     notification.props.message = (
    //       <div
    //         onClick={onClick}
    //         dangerouslySetInnerHTML={createHTML(notification.props.html)}
    //       />
    //     );
    //   }

    //   if (notification.props.time === 0) {
    //     notification.props.onDismiss = () => {
    //       console.log('onDismiss');
    //     };
    //   }

    //   notify(notification.props);

    //   this.props.getInvites();
    // }

    if (notification.type === 'modal') {
      this.setState({ notification });
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      notification: null
    };
  }

  componentDidMount() {
    this.props.socket.on(NOTIFICATION, this.onMessage);

    const { user } = this.props.state;

    this.props.socket.emit(CREATE_USER_CHANNEL, { user });
  }

  componentWillUnmount() {
    this.props.socket.off(NOTIFICATION, this.onMessage);
  }

  render() {
    const { notification } = this.state;
    const ariaLabelledby = Identity.key(notification);

    let notificationProps = notification ? notification.props : null;

    const header = notificationProps ? notificationProps.header || '' : null;
    const icon = notificationProps ? notificationProps.icon || 'bell' : null;
    const size = notificationProps ? notificationProps.size || 'large' : null;
    const content = notificationProps ? notificationProps.content || '' : null;
    const html = notificationProps ? notificationProps.html || '' : null;

    const modalContent = html ? (
      <div dangerouslySetInnerHTML={createHTML(html)} />
    ) : (
      content
    );

    return (
      <Fragment>
        <ToastContainer />
        {notification ? (
          <Modal.Accessible open>
            <Modal
              open
              closeIcon
              closeOnEscape
              closeOnDimmerClick
              role="dialog"
              aria-modal="true"
              size={size}
              aria-labelledby={ariaLabelledby}
            >
              <Header
                tabIndex="0"
                icon={icon}
                id={ariaLabelledby}
                content={header}
              />
              <Modal.Content tabIndex="0">{modalContent}</Modal.Content>
            </Modal>
          </Modal.Accessible>
        ) : null}
      </Fragment>
    );
  }
}

Notification.propTypes = {
  history: PropTypes.object,
  socket: PropTypes.object,
  state: PropTypes.object
};

const mapStateToProps = state => {
  // `rules` are checked against the entire state store.
  return { state };
};

const mapDispatchToProps = dispatch => ({
  getInvites: () => dispatch(getInvites())
});

export default withSocket(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Notification)
  )
);
