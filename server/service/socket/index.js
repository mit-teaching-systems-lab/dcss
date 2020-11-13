const SocketIO = require('socket.io');
const {
  AGENT_JOINED,
  USER_JOINED,
  AGENT_ADDED,
  USER_ADDED,
  NOTIFICATION
} = require('./types');

let numUsers = 0;

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
      let addedUser = false;

      socketlog('Connected');

    });
  }
}

module.exports = SocketManager;
