import React from 'react';
import PropTypes from 'prop-types';
import Socket from 'socket.io-client';

import {
  // Client -> Server
  AGENT_JOINED,
  USER_JOINED,
  NOTIFICATION_RECEIVED,
  // Server -> Client
  AGENT_ADDED,
  USER_ADDED,
  // Client -> Server -> Client
  NEW_MESSAGE
} from '@server/service/socket/types';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
export default function(Component) {
  /* PORT is "embedded" by webpack */
  const port = typeof PORT !== 'undefined' ? PORT : 3000;
  const endpoint = location.origin.replace(/:\d.*/, `:${port}`);
  const socket = new Socket(endpoint, {
    transports: ['websocket']
  });
  class withSocket extends React.Component {
    componentWillUnmount() {
      if (socket) {
        socket.disconnect();
      }
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
