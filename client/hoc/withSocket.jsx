import React from 'react';
import PropTypes from 'prop-types';
import Client from 'socket.io-client';
export * as STATES from '@server/service/socket/states';
export * from '@server/service/socket/types';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/* PORT is "embedded" by webpack */
const port = typeof PORT !== 'undefined' ? PORT : 3000;
const endpoint = location.origin.replace(/:\d.*/, `:${port}`);
const transports = ['websocket', 'polling'];
const settings = {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
};

let socket = null;

function getSocketOrCreate() {
  if (socket) {
    return socket;
  }
  // This block provides a TDZ boundary
  {
    socket = new Client(endpoint, {
      ...settings,
      transports
    });
    return socket;
  }
}

export default function(Component) {
  let socket = getSocketOrCreate();
  class withSocket extends React.Component {
    onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && socket.disconnected) {
        socket.connect();
      }
    };
    componentDidMount() {
      document.addEventListener(
        'visibilitychange',
        this.onVisibilityChange,
        false
      );
    }
    componentWillUnmount() {
      document.removeEventListener(
        'visibilitychange',
        this.onVisibilityChange,
        false
      );
    }
    render() {
      return <Component {...this.props} socket={socket} />;
    }
  }

  withSocket.displayName = `withSocket(${getDisplayName(Component)})`;
  withSocket.propTypes = {
    socket: PropTypes.object
  };
  return withSocket;
}
