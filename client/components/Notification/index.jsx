import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import objectPath from 'object-path';
import { Button, Header, Modal } from '@components/UI';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import withSocket, { NOTIFICATION } from '@hoc/withSocket';

import './Notification.css';

const cache = new Set();

export function notify({
  color,
  icon = '',
  message = '',
  title = '',
  size = 'tiny',
  time = 2000,
  type = 'info'
}) {
  const description = message;
  const props = {
    title,
    description,
    icon,
    size,
    time,
    type
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
    toast(props, () => {
      cache.delete(key);
    });
  }
}


function checkNotificationRules(state, rules) {
  console.log(state);
  return Object.entries(rules).every(([key, value]) => {
    return objectPath.get(state, key) === value;
  });
}

function createHTML(html) {
  return {__html: html};
}

class Notification extends Component {
  onMessage = notification => {
    const canShowNotification = checkNotificationRules(this.props.state, notification.rules);

    if (!canShowNotification) {
      return;
    }

    if (notification.type === 'toast') {
      notify(notification.props);
    }

    if (notification.type === 'modal') {
      console.log('do a modal');
      this.setState({ notification });
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      notification: null
    };
  }

  // componentDidUpdate() {
  //   const {
  //     notification,
  //   } = this.state;

  //   if (notification) {
  //     console.log("State changed, which caused an update, which means we might have a notification to show");

  //     const {
  //       created_at,
  //       starts_at,
  //       expires_at,
  //       props,
  //       rules,
  //       type
  //     } = notification;

  //     console.log(
  //       created_at,
  //       starts_at,
  //       expires_at,
  //       props,
  //       rules,
  //       type
  //     );

  //     notify({color: 'green', message: 'hi!'});

  //   }
  // }

  componentDidMount() {
    this.props.socket.on(NOTIFICATION, this.onMessage);
  }

  componentWillUnmount() {
    this.props.socket.off(NOTIFICATION, this.onMessage);
  }

  render() {
    const { notification } = this.state;
    const ariaLabelledby = Identity.key(notification);

    let notificationProps = notification
      ? notification.props
      : null;

    const header = notificationProps
      ? notificationProps.header || ''
      : null;

    const icon = notificationProps
      ? notificationProps.icon || 'bell'
      : null;

    const size = notificationProps
      ? notificationProps.size || 'large'
      : null;

    const content = notificationProps
      ? notificationProps.content || ''
      : null;

    const html = notificationProps
      ? notificationProps.html || ''
      : null;

    const modalContent = html
      ? <div dangerouslySetInnerHTML={createHTML(html)} />
      : content;

    return (
      <Fragment>
        <SemanticToastContainer />
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
  socket: PropTypes.object,
  state: PropTypes.object
};

const mapStateToProps = state => {
  // `rules` are checked against the entire state store.
  return { state };
};

// const mapDispatchToProps = dispatch => ({});

export default withSocket(connect(mapStateToProps, null)(Notification));
