import React from 'react';
import PropTypes from 'prop-types';
import Socket from 'socket.io-client';

import {
  // Client -> Server
  AGENT_JOIN,
  USER_JOIN,
  USER_PART,
  NOTIFICATION,
  // Server -> Client
  AGENT_ADDED,
  USER_ADDED,
  // Client -> Server -> Client
  NEW_MESSAGE
} from '@server/service/socket/types';

export * from '@server/service/socket/types';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/* PORT is "embedded" by webpack */
const port = typeof PORT !== 'undefined' ? PORT : 3000;
const endpoint = location.origin.replace(/:\d.*/, `:${port}`);
const transports = ['websocket', 'polling'];

let socket = null;

function getSocketOrCreate() {
  if (socket) {
    return socket;
  }
  // This block provides a TDZ boundary
  {
    socket = new Socket(endpoint, { transports });
    return socket;
  }
}

export default function(Component) {
  let socket = getSocketOrCreate();
  class withSocket extends React.Component {
    componentWillUnmount() {
      if (socket) {
        socket.disconnect();
        socket = null;
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
