const { parse } = require('node-html-parser');
const hash = require('object-hash');
const Socket = require('./');
const { notifier } = require('../../util/db');
const {
  CHAT_AGENT_PAUSE,
  CHAT_AGENT_START,
  CHAT_CREATED,
  CHAT_CLOSED_FOR_SLIDE,
  CHAT_CLOSED,
  CHAT_ENDED,
  CHAT_OPENED,
  CHAT_QUORUM_FOR_SLIDE,
  CHAT_MESSAGE_CREATED,
  CHAT_MESSAGE_UPDATED,
  CREATE_CHAT_CHANNEL,
  CREATE_CHAT_SLIDE_CHANNEL,
  CREATE_CHAT_USER_CHANNEL,
  CREATE_COHORT_CHANNEL,
  CREATE_USER_CHANNEL,
  DISCONNECT,
  HEART_BEAT,
  JOIN_OR_PART,
  NEW_INVITATION,
  NOTIFICATION,
  RUN_AGENT_END,
  RUN_AGENT_START,
  RUN_CHAT_LINK,
  SET_INVITATION,
  TIMER_END,
  TIMER_START,
  TIMER_STOP,
  TIMER_TICK,
  USER_JOIN,
  USER_PART,
  USER_JOIN_SLIDE,
  USER_PART_SLIDE
} = require('./types');
const authdb = require('../session/db');
const agentdb = require('../agents/db');
const chatdb = require('../chats/db');
const rundb = require('../runs/db');
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
  messages: [],
  //
  // Track user presence in rooms
  //
  //  - Used for "announcing" participants in channel.
  //  - Used for triggering automatic timers.
  //
  rolls: {
    /*
      [room key]: [
        user.id
      ]
    */
  },
  clients: {
    /*
      [room key]: socket client
    */
  }
};

const extractTextContent = html => parse(html).textContent;

const makeRemoteSafeAuthPayload = data => {
  const { agent, chat = {}, run = {}, user } = data;
  const payload = {
    agent: {
      id: agent.id,
      name: agent.name,
      configuration: agent.configuration
    },
    chat: {
      id: chat.id
    },
    run: {
      id: run.id
    },
    user: {
      id: user.id,
      name: user.personalname || user.username
    }
  };
  return payload;
};

class SocketManager {
  constructor(server) {
    if (process.env.DB_CONFIG && process.env.DB_CONFIG === 'test') {
      return;
    }

    this.io = new Socket.Server(server);
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
          console.log('chat_message_created', data);

          // If the message is for a specific participant...
          const room = data.recipient_id
            ? `${data.chat_id}-user-${data.recipient_id}`
            : data.chat_id;

          this.io.to(room).emit(CHAT_MESSAGE_CREATED, data);

          // Check if there is an active agent client for
          // the user that wrote the message. If there is,
          // we'll send the contents of their message to
          // the agent.

          const clientKey = `${data.chat_id}-user-${data.user_id}`;
          console.log(clientKey);
          if (cache.clients[clientKey]) {
            const { client, auth } = cache.clients[clientKey];

            // IMPORTANT! THIS WILL ONLY SEND TEXT CONTENT!
            // ANY IMAGE ATTACHMENTS OR EMBEDS WILL BE IGNORED
            //
            // console.log(client);
            const value = extractTextContent(data.content);
            console.log(auth);
            console.log(data);

            client.emit('request', {
              value
            });
          }
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

          // If we allow late arriving agents to trigger JOIN_OR_PART,
          // it will result in the Chat component reloading ChatMessages,
          // which will send a socket message to activate the agent, which
          // will loop back to here causing an infinit loop.
          if (!user.is_agent) {
            // Send JOIN_OR_PART signal BEFORE creating the chat message announcement
            this.io.to(data.chat_id).emit(JOIN_OR_PART, {
              chat: {
                id: data.chat_id
              },
              user
            });

            const message = data.is_present
              ? 'has joined the chat.'
              : 'has left the chat.';

            await chatdb.updateJoinPartMessages(data.chat_id, data.user_id, {
              deleted_at: new Date().toISOString()
            });

            await chatdb.insertNewJoinPartMessage(
              data.chat_id,
              data.user_id,
              message
            );
          }
        });

        // console.log('join_or_part_chat listener is registered');
      }

      if (!notifier.listenerCount('run_chat_link')) {
        notifier.on('run_chat_link', async data => {
          console.log('run_chat_link', data);
          const chat = await chatdb.getChat(data.chat_id);
          const user = await chatdb.getChatUserByChatId(
            data.chat_id,
            data.user_id
          );
          this.io.to(chat.host_id).emit(RUN_CHAT_LINK, {
            chat,
            user
          });
        });
        // console.log('run_chat_link listener is registered');
      }

      if (!notifier.listenerCount('new_invitation')) {
        notifier.on('new_invitation', async data => {
          console.log('new_invitation', data);
          this.io
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
          console.log('set_invitation', data);
          this.io
            .to(data.receiver_id)
            .emit(
              SET_INVITATION,
              await chatutil.makeChatInviteNotification(data)
            );
          this.io
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
          this.io.to(chat.cohort_id).emit(CHAT_CREATED, {
            chat
          });
        });
        // console.log('chat_invite listener is registered');
      }

      if (!notifier.listenerCount('chat_ended')) {
        notifier.on('chat_ended', async chat => {
          console.log('chat_ended', chat);
          this.io.to(chat.id).emit(CHAT_ENDED, {
            chat
          });
        });
        // console.log('chat_invite listener is registered');
      }

      const sendRunResponseToAgent = data => {
        const clientKey = `${data.run_id}-${data.user_id}-${data.response_id}`;

        console.log('sendRunResponseToAgent, clientKey', clientKey);
        console.log('sendRunResponseToAgent, data', data);

        console.log(cache.clients[clientKey]);
        if (cache.clients[clientKey]) {
          const { client, auth } = cache.clients[clientKey];

          const { id, response_id, transcript = '', value = '' } = data;

          // console.log(auth);
          // console.log(data);

          if (value) {
            console.log('sendRunResponseToAgent: ', data);
            client.emit('request', {
              auth,
              id,
              response_id,
              transcript,
              value
            });
          }
        }
      };

      if (!notifier.listenerCount('agent_response_created')) {
        notifier.on('agent_response_created', async data => {
          console.log('agent_response_created', data);
          const room = `${data.run_id}-${data.user_id}-${data.response_id}`;
          this.io.to(room).emit(AGENT_RESPONSE_CREATED, data);
        });
      }

      if (!notifier.listenerCount('run_response_created')) {
        notifier.on('run_response_created', async data => {
          console.log('run_response_created', data);
          sendRunResponseToAgent(data);
        });
      }

      if (!notifier.listenerCount('run_response_updated')) {
        notifier.on('run_response_updated', async data => {
          console.log('run_response_updated', data);
          sendRunResponseToAgent(data);
        });
      }

      // if (!notifier.listenerCount('audio_transcript_created')) {
      //   notifier.on('audio_transcript_created', async data => {
      //     console.log('audio_transcript_created', data);
      //   });
      //   // console.log('chat_message_created listener is registered');
      // }

      // if (!notifier.listenerCount('audio_transcript_updated')) {
      //   notifier.on('audio_transcript_updated', async data => {
      //     console.log('audio_transcript_updated', data);
      //     // socket.broadcast.emit(CHAT_MESSAGE_UPDATED, data);
      //   });
      // }

      // Site
      socket.on(CHAT_AGENT_PAUSE, async props => {
        console.log(CHAT_AGENT_PAUSE, props);
      });

      socket.on(CHAT_AGENT_START, async ({ agent, chat, user }) => {
        console.log(CHAT_AGENT_START, { agent, chat, user });
        if (agent && agent.id) {
          const room = `${chat.id}-user-${user.id}`;
          socket.join(room);

          const auth = makeRemoteSafeAuthPayload({ agent, chat, user });
          const options = {
            ...agent.socket,
            auth
          };

          const client = new Socket.Client(agent.endpoint, options);

          if (client) {
            await chatdb.joinChat(chat.id, agent.self.id);
          }

          client.on('response', ({ value, result }) => {
            console.log(
              `The text "${value}" ${
                result ? 'contains an emoji' : 'does not contain an emoji'
              }`
            );
          });

          client.on('interjection', async ({ message }) => {
            await chatdb.insertNewAgentMessage(
              chat.id,
              agent.self.id, // This comes from the agent!!
              message,
              null, // TODO: need the response_id from the slide component
              user.id
            );
          });

          // cache.backlog[user.id] = {
          //   socket,
          //   messages: []
          // };

          cache.clients[room] = {
            client,
            auth
          };
        }
      });

      socket.on(RUN_AGENT_START, async ({ run, user }) => {
        console.log(RUN_AGENT_START, { run, user });
        const prompts = await agentdb.getScenarioAgentPrompts(run.scenario_id);

        for (const prompt of prompts) {
          const { agent } = prompt;

          if (agent && agent.id) {
            const room = `${run.id}-${run.user_id}-${prompt.response_id}`;
            socket.join(room);

            if (!cache.clients[room]) {
              const auth = makeRemoteSafeAuthPayload({ agent, run, user });
              const options = {
                ...agent.socket,
                auth
              };

              const client = new Socket.Client(agent.endpoint, options);

              client.on('response', async response => {
                console.log('AGENT RESPONSE: ', response);
                await agentdb.insertNewAgentResponse(
                  // agent_id
                  agent.id,
                  // chat_id
                  null,
                  // interaction_id
                  agent.interaction.id,
                  // prompt_response_id
                  response.response_id,
                  // recipient_id
                  user.id,
                  // response_id
                  response.id,
                  // run_id
                  run.id,
                  // response
                  response
                );
              });

              cache.clients[room] = {
                client,
                auth
              };
            }
          }
        }
      });

      socket.on(RUN_AGENT_END, async ({ run }) => {
        console.log(RUN_AGENT_END, { run });
        // socket.join(user.id);

        const agents = await agentdb.getScenarioAgents(run.scenario_id);

        console.log(agents);
      });

      socket.on(CREATE_USER_CHANNEL, ({ user }) => {
        console.log(CREATE_USER_CHANNEL, { user });
        socket.join(user.id);
      });

      socket.on(CREATE_CHAT_CHANNEL, ({ chat }) => {
        console.log(CREATE_CHAT_CHANNEL, { chat });
        socket.join(chat.id);
      });

      socket.on(CREATE_CHAT_SLIDE_CHANNEL, ({ agent, chat, slide }) => {
        console.log(CREATE_CHAT_SLIDE_CHANNEL, { chat, slide });
        const room = `${chat.id}-slide-${slide.index}`;
        socket.join(room);
      });

      // Used for sending messages to a specific user in the chat.
      socket.on(CREATE_CHAT_USER_CHANNEL, async ({ chat, user }) => {
        console.log(CREATE_CHAT_USER_CHANNEL, { chat, user });
        const room = `${chat.id}-user-${user.id}`;
        socket.join(room);
      });

      socket.on(CREATE_COHORT_CHANNEL, ({ cohort }) => {
        console.log(CREATE_COHORT_CHANNEL, { cohort });
        socket.join(cohort.id);
      });

      socket.on(HEART_BEAT, ({ id }) => {
        console.log(HEART_BEAT, { id });
        authdb.updateUser(id, {
          lastseen_at: new Date().toISOString()
        });
      });

      // Chat
      socket.on(USER_JOIN, async ({ chat, user }) => {
        console.log(USER_JOIN, { chat, user });
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

          await chatdb.updateJoinPartMessages(chat.id, user.id, {
            deleted_at: new Date().toISOString()
          });

          await chatdb.insertNewJoinPartMessage(chat.id, user.id, message);

          const rollKey = `${chat.id}-slide-${run.activeRunSlideIndex}`;

          if (!cache.rolls[rollKey]) {
            cache.rolls[rollKey] = [];
          }

          // Remove them from other rolls.
          Object.entries(cache.rolls).forEach(([key, roll]) => {
            if (key !== rollKey) {
              const index = cache.rolls[key].indexOf(user.id);
              if (index !== -1) {
                cache.rolls[key].splice(index, 1);
              }
            }
          });

          if (!cache.rolls[rollKey].includes(user.id)) {
            cache.rolls[rollKey].push(user.id);
          }

          const users = await chatdb.getLinkedChatUsersByChatId(chat.id);
          const quorum = users.every(({ id }) =>
            cache.rolls[rollKey].includes(id)
          );

          if (quorum) {
            const room = `${chat.id}-user-${chat.host_id}`;
            this.io.to(room).emit(CHAT_QUORUM_FOR_SLIDE, {
              chat,
              user: {
                id: chat.host_id
              }
            });
          }
        }
      });

      socket.on(USER_PART_SLIDE, async ({ chat, user, run }) => {
        console.log(USER_PART_SLIDE, chat, user, run);

        if (run) {
          const rollKey = `${chat.id}-slide-${run.activeRunSlideIndex}`;

          if (!cache.rolls[rollKey]) {
            cache.rolls[rollKey] = [];
          }

          if (cache.rolls[rollKey].includes(user.id)) {
            cache.rolls[rollKey].splice(
              cache.rolls[rollKey].indexOf(user.id),
              1
            );
            // console.log('UPDATED ROLLS: ', cache.rolls[rollKey]);
          }
        }
      });

      socket.on(USER_PART, ({ chat, user }) => {
        chatdb.partChat(chat.id, user.id);
      });

      socket.on(CHAT_MESSAGE_CREATED, ({ chat, user, content, response }) => {
        chatdb.createNewChatMessage(chat.id, user.id, content, response.id);
      });

      socket.on(CHAT_CLOSED_FOR_SLIDE, ({ chat, user, slide, result }) => {
        console.log(CHAT_CLOSED_FOR_SLIDE, { chat, user, slide, result });
        const room = `${chat.id}-slide-${slide.index}`;
        cache.rolls[room] = null;
        this.io.to(room).emit(CHAT_CLOSED_FOR_SLIDE, {
          chat,
          slide,
          result
        });
      });

      const timers = {};

      socket.on(TIMER_START, async ({ chat, user, slide, timeout }) => {
        console.log(TIMER_START, { chat, user, slide, timeout });
        const room = `${chat.id}-slide-${slide.index}`;

        if (!timers[room]) {
          this.io.to(room).emit(TIMER_START, {
            chat,
            user,
            slide,
            timeout
          });

          // wait until the next execution turn to start the timer
          await 0;

          timers[room] = setInterval(() => {
            timeout--;

            // Intentionally using this.io here, instead of
            // socket, to ensure that all clients recieve
            // these ticks. Using socket will omit the sending
            // socket from the list of recipients.
            this.io.to(room).emit(TIMER_TICK, {
              timeout
            });
            if (!timeout) {
              clearInterval(timers[room]);
              timers[room] = null;
              const result = 'timeout';
              this.io.to(room).emit(TIMER_END, {
                chat,
                user,
                slide,
                result
              });
            }
          }, 1000);
        }
      });

      // socket.on(TIMER_END, ({ chat, user, slide, result }) => {
      //   const room = `${chat.id}-${slide.index}`;

      //   clearInterval(timers[room]);

      //   this.io.to(room).emit(TIMER_END, {
      //     chat,
      //     slide,
      //     result
      //   });
      // });

      //       socket.on(TIMER_TICK, ({ chat, user, slide }) => {
      // console.log(TIMER_TICK, { chat, user, slide });
      //         const room = `${chat.id}-${slide.index}`;
      //         socket.broadcast.to(room).emit(TIMER_TICK, {
      //           chat
      //         });
      //       });

      //
      // socket.on(DISCONNECT, () => {
      // console.log(DISCONNECT, ();
      //   socketlog(USER_PART, socket.user);
      //   socket.broadcast.emit(USER_PART, {
      //     user: socket.user
      //   });
      // });
    });
  }
}

module.exports = SocketManager;
