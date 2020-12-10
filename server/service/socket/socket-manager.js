const SocketIO = require('socket.io');
const { notifier } = require('../../util/db');
const {
  AGENT_JOIN,
  DISCONNECT,
  JOIN_OR_PART,
  NEW_MESSAGE,
  NOTIFICATION,
  USER_JOIN,
  USER_PART
} = require('./types');
const chatdb = require('../chats/db');

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
      //
      if (!notifier.listenerCount('new_notification')) {
        notifier.on('new_notification', data => {
          // console.log('new_notification', data);
          if (!cache.notifications.includes(data.id)) {
            cache.notifications.push(data.id);
            socket.broadcast.emit(NOTIFICATION, data);
          }
        });
        console.log('new_notification listener is registered');
      }

      if (!notifier.listenerCount('new_chat_message')) {
        notifier.on('new_chat_message', data => {
          // console.log('new_chat_message', data);
          socket.broadcast.emit(NEW_MESSAGE, data);
        });
        console.log('new_chat_message listener is registered');
      }

      if (!notifier.listenerCount('join_or_part_chat')) {
        notifier.on('join_or_part_chat', data => {
          console.log('join_or_part_chat', data);
          const message = data.is_present
            ? 'has joined the chat.'
            : 'has left the chat.';
          const content = `
            <p><span style="color: rgb(140, 140, 140);"><em>${message}</em></span><br></p>
          `.trim();

          // Send JOIN_OR_PART signal BEFORE creating the chat message announcement
          socket.broadcast.emit(JOIN_OR_PART, data);

          chatdb.createNewChatMessage(data.chat_id, data.user_id, content);
        });

        console.log('join_or_part_chat listener is registered');
      }

      // Chat
      socket.on(USER_JOIN, ({ chat, user }) => {
        socketlog(USER_JOIN, user);
        chatdb.joinChat(chat.id, user.id);
        // socket.user = user;
        // socket.broadcast.emit(USER_JOIN, {
        //   user: socket.user
        // });
      });

      socket.on(USER_PART, ({ chat, user }) => {
        socketlog(USER_PART, user);
        chatdb.partChat(chat.id, user.id);
        // socket.broadcast.emit(USER_PART, {
        //   user: socket.user
        // });
      });
      //
      socket.on(NEW_MESSAGE, ({ chat, user, content }) => {
        chatdb.createNewChatMessage(chat.id, user.id, content);
      });
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
