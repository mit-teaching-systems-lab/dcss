const SocketIO = require('socket.io');
const { notifier } = require('../../util/db');
const {
  AGENT_JOIN,
  CHAT_CREATED,
  CHAT_ENDED,
  CHAT_MESSAGE_CREATED,
  CHAT_MESSAGE_UPDATED,
  CREATE_CHAT_CHANNEL,
  CREATE_COHORT_CHANNEL,
  CREATE_USER_CHANNEL,
  DISCONNECT,
  HEART_BEAT,
  JOIN_OR_PART,
  NEW_INVITATION,
  NOTIFICATION,
  RUN_CHAT_LINK,
  SET_INVITATION,
  USER_JOIN,
  USER_PART,
  USER_JOIN_SLIDE,
  USER_SLIDE_PART_SLIDE
} = require('./types');
const authdb = require('../session/db');
const chatdb = require('../chats/db');
const chatutil = require('../chats/util');

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
    if (process.env.DB_CONFIG && process.env.DB_CONFIG === 'test') {
      return;
    }

    this.io = SocketIO(server);
    this.io.on('connection', socket => {
      socketlog('Connected', socket.id);

      // Notifications
      //
      // TODO: Refactor and move these to entity specific services.
      //
      //
      if (!notifier.listenerCount('new_notification')) {
        notifier.on('new_notification', data => {
          console.log('new_notification', data);
          if (!cache.notifications.includes(data.id)) {
            cache.notifications.push(data.id);

            //
            //
            // TODO: look at "data" and determine if
            //        this is a specific user notification.
            //        if yes, then use "socket.to(user.id).emit(...)"
            //
            //
            //

            socket.broadcast.emit(NOTIFICATION, data);
          }
        });
        // console.log('new_notification listener is registered');
      }

      if (!notifier.listenerCount('chat_message_created')) {
        notifier.on('chat_message_created', data => {
          // console.log('chat_message_created', data);
          socket.broadcast.emit(CHAT_MESSAGE_CREATED, data);
        });
        // console.log('chat_message_created listener is registered');
      }

      if (!notifier.listenerCount('chat_message_updated')) {
        notifier.on('chat_message_updated', data => {
          // console.log('chat_message_updated', data);
          socket.broadcast.emit(CHAT_MESSAGE_UPDATED, data);
        });
        // console.log('chat_message_updated listener is registered');
      }

      if (!notifier.listenerCount('join_or_part_chat')) {
        notifier.on('join_or_part_chat', async data => {
          console.log('join_or_part_chat', data);

          const user = await chatdb.getChatUserByChatId(
            data.chat_id,
            data.user_id
          );
          // Send JOIN_OR_PART signal BEFORE creating the chat message announcement
          socket.broadcast.emit(JOIN_OR_PART, {
            chat: {
              id: data.chat_id
            },
            user
          });

          const message = data.is_present
            ? 'has joined the chat.'
            : 'has left the chat.';
          const content = `
            <p><span style="color: rgb(140, 140, 140);"><em>${message}</em></span><br></p>
          `.trim();

          await chatdb.updateJoinPartMessages(data.chat_id, data.user_id, {
            deleted_at: new Date().toISOString()
          });

          await chatdb.insertNewJoinPartMessage(
            data.chat_id,
            data.user_id,
            content
          );
        });

        // console.log('join_or_part_chat listener is registered');
      }

      if (!notifier.listenerCount('run_chat_link')) {
        notifier.on('run_chat_link', async data => {
          // console.log('run_chat_link', data);
          const chat = await chatdb.getChatById(data.chat_id);
          const user = await chatdb.getChatUserByChatId(
            data.chat_id,
            data.user_id
          );
          socket.to(chat.host_id).emit(RUN_CHAT_LINK, {
            chat,
            user
          });
        });
        // console.log('run_chat_link listener is registered');
      }

      if (!notifier.listenerCount('new_invitation')) {
        notifier.on('new_invitation', async data => {
          // console.log('new_invitation', data);
          socket
            .to(data.receiver_id)
            .emit(
              NEW_INVITATION,
              await chatutil.makeChatInviteNotification(data)
            );
        });
        // console.log('chat_invite listener is registered');
      }

      if (!notifier.listenerCount('set_invitation')) {
        notifier.on('set_invitation', async data => {
          // console.log('set_invitation', data);
          socket
            .to(data.receiver_id)
            .emit(
              SET_INVITATION,
              await chatutil.makeChatInviteNotification(data)
            );
          socket
            .to(data.sender_id)
            .emit(
              SET_INVITATION,
              await chatutil.makeChatInviteNotification(data)
            );
        });
        // console.log('chat_invite listener is registered');
      }

      if (!notifier.listenerCount('chat_created')) {
        notifier.on('chat_created', async chat => {
          console.log('chat_created', chat);
          socket.to(chat.cohort_id).emit(CHAT_CREATED, {
            chat
          });
        });
        // console.log('chat_invite listener is registered');
      }

      if (!notifier.listenerCount('chat_ended')) {
        notifier.on('chat_ended', async chat => {
          console.log('chat_ended', chat);
          socket.to(chat.id).emit(CHAT_ENDED, {
            chat
          });
        });
        // console.log('chat_invite listener is registered');
      }

      // Site
      socket.on(CREATE_USER_CHANNEL, ({ user }) => {
        socket.join(user.id);
      });

      socket.on(CREATE_CHAT_CHANNEL, ({ chat }) => {
        socket.join(chat.id);
      });

      socket.on(CREATE_COHORT_CHANNEL, ({ cohort }) => {
        socket.join(cohort.id);
      });

      socket.on(HEART_BEAT, ({ id }) => {
        authdb.updateUser(id, {
          lastseen_at: new Date().toISOString()
        });
      });

      // Chat
      socket.on(USER_JOIN, async ({ chat, user }) => {
        const chatUser = await chatdb.getChatUserByChatId(chat.id, user.id);
        chatdb.joinChat(chat.id, user.id, chatUser.persona_id);
      });

      socket.on(USER_JOIN_SLIDE, async ({ chat, user, run }) => {
        console.log(USER_JOIN_SLIDE, chat, user, run);

        if (run) {
          const message = run.activeRunSlideIndex
            ? `is on slide #${run.activeRunSlideIndex}`
            : null;

          if (!message) {
            return;
          }

          const content = `
            <p><span style="color: rgb(140, 140, 140);"><em>${message}</em></span><br></p>
          `.trim();

          await chatdb.updateJoinPartMessages(chat.id, user.id, {
            deleted_at: new Date().toISOString()
          });

          await chatdb.insertNewJoinPartMessage(chat.id, user.id, content);
        }
      });

      socket.on(USER_PART, ({ chat, user }) => {
        chatdb.partChat(chat.id, user.id);
      });

      socket.on(CHAT_MESSAGE_CREATED, ({ chat, user, content }) => {
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
