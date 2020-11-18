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
      socketlog('Connected', socket.id);


      // TODO: Add this to types?
      notifier.on('new_notification', data => {
        console.log('new_notification', data);

        socket.broadcast.emit(NOTIFICATION, data);
      });
      setTimeout(() => {
        socket.broadcast.emit(NOTIFICATION, {
          a: 1,
          broadcast: true
        });
      }, 3000);
    });
  }
}

module.exports = SocketManager;
