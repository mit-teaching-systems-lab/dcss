const SocketIO = require('socket.io');
const { notifier } = require('../../util/db');
const {
  AGENT_JOIN,
  DISCONNECT,
  USER_JOIN,
  USER_PART,
  NEW_MESSAGE,
  NOTIFICATION,
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

const cache = {
  notifications: [],
  messages: []
};

class SocketManager {
  constructor(server) {
    this.io = SocketIO(server);
    this.io.on('connection', socket => {
      socketlog('Connected', socket.id);

      // Notifications
      notifier.on('new_notification', data => {
        console.log('new_notification', data);

        if (!cache.notifications.includes(data.id)) {
          cache.notifications.push(data.id);
          socket.broadcast.emit(NOTIFICATION, data);
        }
      });

      notifier.on('new_chat_message', data => {
        console.log('new_chat_message', data);

        socket.broadcast.emit(NEW_MESSAGE, data);
      });

      // Chat
      // socket.on(USER_JOIN, ({ user }) => {
      //   socketlog(USER_JOIN, user);
      //   socket.user = user;
      //   socket.broadcast.emit(USER_JOIN, {
      //     user: socket.user
      //   });
      // });
      //
      // socket.on(USER_PART, ({ user }) => {
      //   socketlog(USER_PART, user);
      //   socket.broadcast.emit(USER_PART, {
      //     user: socket.user
      //   });
      // });
      //
      // socket.on(NEW_MESSAGE, ({ message }) => {
      //   socketlog(NEW_MESSAGE, message);
      //   socket.broadcast.emit(NEW_MESSAGE, {
      //     message
      //   });
      // });
      //
      // socket.on(DISCONNECT, () => {
      //   socketlog(USER_PART, socket.user);
      //   socket.broadcast.emit(USER_PART, {
      //     user: socket.user
      //   });
      // });
    });
  }
}

module.exports = SocketManager;
