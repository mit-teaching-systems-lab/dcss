const SocketIO = require('socket.io');
const { notifier } = require('../../util/db');
const {
  AGENT_JOINED,
  USER_JOINED,
  AGENT_ADDED,
  USER_ADDED,
  NOTIFICATION
} = require('./types');

function socketlog(...args) {
  console.log('');
  console.log('');
  console.log('SOCKET LOG ');
  console.log('------------------------------------------------------------ ');
  console.log(...args);
  console.log('------------------------------------------------------------ ');
  console.log('');
  console.log('');
}

class SocketManager {
  constructor(server) {
    this.io = SocketIO(server);
    this.io.on('connection', socket => {
      socketlog('Connected');

      notifier.on('new_notification', data => {
        console.log('new_notification', data);
      });
    });
  }
}

module.exports = SocketManager;
