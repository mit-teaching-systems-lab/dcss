const { createAdapter } = require('@socket.io/redis-adapter');
const { getRedisConfig } = require('../../util/redisConfig');
const hash = require('object-hash');
const Identity = require('../../util/identity');
const { notifier } = require('../../util/db');
const { parse } = require('node-html-parser');
const { createClient } = require('redis');
const Socket = require('./');
const {
  AGENT_RESPONSE_CREATED,
  CHAT_AGENT_PAUSE,
  CHAT_AGENT_START,
  CHAT_CREATED,
  CHAT_CLOSED_FOR_SLIDE,
  CHAT_CLOSED,
  CHAT_ENDED,
  CHAT_OPENED,
  CHAT_MESSAGE_CREATED,
  CHAT_MESSAGE_UPDATED,
  CHAT_STATE,
  CHAT_USER_AWAITING_MATCH,
  CHAT_USER_CANCELED_MATCH_REQUEST,
  CHAT_USER_MATCHED,
  CREATE_CHAT_CHANNEL,
  CREATE_CHAT_SLIDE_CHANNEL,
  CREATE_CHAT_USER_CHANNEL,
  CREATE_COHORT_CHANNEL,
  CREATE_SHARED_RESPONSE_CHANNEL,
  CREATE_USER_CHANNEL,
  DISCONNECT,
  FACILITATOR_CREATED_MATCH_REQUEST,
  FACILITATOR_CANCELED_MATCH_REQUEST,
  HEART_BEAT,
  HOST_JOIN,
  JOIN_OR_PART,
  NEW_INVITATION,
  NOTIFICATION,
  PING,
  PONG,
  REDIRECT,
  RUN_AGENT_END,
  RUN_AGENT_START,
  RUN_CHAT_LINK,
  SET_INVITATION,
  SHARED_RESPONSE_CREATED,
  SHARED_RESPONSE_UPDATED,
  RUN_RESPONSE_CREATED,
  RUN_RESPONSE_UPDATED,
  TIMER_END,
  TIMER_START,
  TIMER_STOP,
  TIMER_TICK,
  USER_JOIN,
  USER_PART,
  USER_JOIN_SLIDE,
  USER_PART_SLIDE,
  USER_TYPING,
  USER_TYPING_UPDATE
} = require('./types');
const {
  CHAT_IS_PENDING,
  CHAT_IS_ACTIVE,
  CHAT_IS_CLOSED,
  CHAT_IS_CLOSED_COMPLETE,
  CHAT_IS_CLOSED_INCOMPLETE,
  CHAT_IS_CLOSED_TIMEOUT
} = require('./states');

const EVENT_TYPES = require('../runs/event-types');
const authdb = require('../session/db');
const agentsdb = require('../agents/db');
const db = require('./db');
const chatsdb = require('../chats/db');
const cohortsdb = require('../cohorts/db');
const personasdb = require('../personas/db');
const runsdb = require('../runs/db');
const scenariosdb = require('../scenarios/db');
const chatutil = require('../chats/util');

async function saveRunEvent(run_id, user_id, name, context) {
  try {
    await runsdb.saveRunEvent(run_id, user_id, name, context);
  } catch (error) {
    console.log('ERROR: Could not save run event. ', error);
  }
}

async function saveUserEvent(user_id, name, context) {
  try {
    await runsdb.saveUserEvent(user_id, name, context);
  } catch (error) {
    console.log('ERROR: Could not save run event. ', error);
  }
}

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
  clients: {
    /*
      [chat.id-slide-slide.id]: socket client
    */
  },
  //
  // Track user presence in rooms
  //
  //  - Used for "announcing" participants in channel.
  //  - Used for triggering automatic timers.
  //
  notifications: [],
  messages: [],

  discussions: {
    /*
      [chat.id-slide-slide.id]:
        CHAT_IS_PENDING | CHAT_IS_ACTIVE | CHAT_IS_CLOSED_COMPLETE |
        CHAT_IS_CLOSED_INCOMPLETE | CHAT_IS_CLOSED_TIMEOUT
    */
  },
  rollCalls: new Map(/*
    [
      [chat.id-slide-slide.id, user.id]
    ]
  */),
  timers: {
    /*
      [chat.id-slide-slide.id] = interval;
    */
  },
  waiting: {}
};

const closeResultToStateMap = {
  complete: CHAT_IS_CLOSED_COMPLETE,
  incomplete: CHAT_IS_CLOSED_INCOMPLETE,
  timeout: CHAT_IS_CLOSED_TIMEOUT
};

const extractTextContent = html => parse(html).textContent;

const makeRemoteSafeAuthPayload = data => {
  const { agent = {}, chat = {}, run = {}, user } = data;

  const role = user.role
    ? {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description
      }
    : null;

  const auth = {
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
      name: user.personalname || user.username,
      role
    }
  };

  const token = hash(auth);
  auth.token = token;
  return auth;
};

const DEVELOPER_TOKEN = '8070cb2467d22a15dabafd5f5128cacc04af86f1';
const REDIS_CONFIG = getRedisConfig();

class SocketManager {
  static isValidToken(remoteToken) {
    const tokens = Object.values(cache.clients).map(client => client.auth.token);
    if (process.env.NODE_ENV !== 'production') {
      return [...tokens, DEVELOPER_TOKEN].includes(remoteToken);
    }
    return tokens.includes(remoteToken);
  }

  constructor(server) {
    if (process.env.DB_CONFIG && process.env.DB_CONFIG === 'test') {
      return;
    }

    this.io = new Socket.Server(server);

    if (REDIS_CONFIG) {
      const pubClient = createClient(REDIS_CONFIG);
      const subClient = pubClient.duplicate();
      // console.log('pubClient', pubClient);
      // console.log('subClient', subClient);
      this.io.adapter(createAdapter(pubClient, subClient));
    }

    this.io.on('connection', socket => {
      socketlog('Connected', socket.id);

      // Notifications
      //
      // TODO: Refactor and move these to entity specific services.
      //
      //
      if (!notifier.listenerCount('new_notification')) {
        notifier.on('new_notification', record => {
          console.log('new_notification', record);
          if (!cache.notifications.includes(record.id)) {
            cache.notifications.push(record.id);

            //
            //
            // TODO: look at "record" and determine if
            //        this is a specific user notification.
            //        if yes, then use "socket.to(user.id).emit(...)"
            //
            //
            //

            socket.broadcast.emit(NOTIFICATION, record);
          }
        });
        // console.log('new_notification listener is registered');
      }

      if (!notifier.listenerCount('chat_message_created')) {
        notifier.on('chat_message_created', record => {
          console.log('chat_message_created', record);

          // If the message is for a specific participant...
          const room = record.recipient_id
            ? `${record.chat_id}-user-${record.recipient_id}`
            : record.chat_id;

          this.io.to(room).emit(CHAT_MESSAGE_CREATED, record);

          // Check if there is an active agent client for
          // the user that wrote the message. If there is,
          // we'll send the contents of their message to
          // the agent.

          const clientKey = `${record.chat_id}-user-${record.user_id}`;

          if (cache.clients[clientKey]) {
            const { client, auth } = cache.clients[clientKey];

            // IMPORTANT! THIS WILL ONLY SEND TEXT CONTENT!
            // ANY IMAGE ATTACHMENTS OR EMBEDS WILL BE IGNORED
            //
            // console.log(client);
            const value = extractTextContent(record.content);
            // console.log(auth);
            // console.log(record);

            client.emit('request', {
              record,
              value
            });
          }
        });
        // console.log('chat_message_created listener is registered');
      }

      if (!notifier.listenerCount('chat_message_updated')) {
        notifier.on('chat_message_updated', record => {
          // console.log('chat_message_updated', record);
          socket.broadcast.emit(CHAT_MESSAGE_UPDATED, record);
        });
        // console.log('chat_message_updated listener is registered');
      }

      if (!notifier.listenerCount('join_or_part_chat')) {
        notifier.on('join_or_part_chat', async record => {
          console.log('join_or_part_chat', record);
          const user = await chatsdb.getChatUserByChatId(
            record.chat_id,
            record.user_id
          );

          // If we allow late arriving agents to trigger JOIN_OR_PART,
          // it will result in the Chat component reloading ChatMessages,
          // which will send a socket message to activate the agent, which
          // will loop back to here causing an infinit loop.
          if (!user.is_agent) {
            // Send JOIN_OR_PART signal BEFORE creating the chat message announcement
            this.io.to(record.chat_id).emit(JOIN_OR_PART, {
              chat: {
                id: record.chat_id
              },
              user
            });

            const message = record.is_present
              ? 'has joined the chat.'
              : 'has left the chat.';

            await chatsdb.updateJoinPartMessages(
              record.chat_id,
              record.user_id,
              {
                deleted_at: new Date().toISOString()
              }
            );

            await chatsdb.insertNewJoinPartMessage(
              record.chat_id,
              record.user_id,
              message
            );
          }

          const chat = await chatsdb.getChat(record.chat_id);

          // The host joined and has a persona selected.
          if (
            chat.cohort_id &&
            record.persona_id &&
            record.is_present &&
            chat.host_id === record.user_id
          ) {
            this.io.to(chat.cohort_id).emit(HOST_JOIN);
          }
        });

        // console.log('join_or_part_chat listener is registered');
      }

      if (!notifier.listenerCount('run_chat_link')) {
        notifier.on('run_chat_link', async record => {
          console.log('run_chat_link', record);
          const chat = await chatsdb.getChat(record.chat_id);
          const user = await chatsdb.getChatUserByChatId(
            record.chat_id,
            record.user_id
          );
          this.io.to(chat.host_id).emit(RUN_CHAT_LINK, {
            chat,
            user
          });

          // Check if this user is in a cohort, message the room so they know
          // the user is in a scenario chat now.
          // if (chat.cohort_id) {
          //   const cohort = await cohortsdb.getCohort(chat.cohort_id);
          //   this.io.to(cohort.chat_id).emit(CHAT_MESSAGE_CREATED, {
          //     id: record.id,
          //     chat_id: chat.id,
          //     user_id: record.user_id,
          //     content: '<p class="join-part-slide">has joined the chat.</p>',
          //     created_at: '2021-03-19T15:16:48.731297-04:00',
          //     updated_at: null,
          //     deleted_at: null,
          //     is_quotable: false,
          //     is_joinpart: true,
          //     response_id: '',
          //     recipient_id: null
          //   });
          // }
        });
        // console.log('run_chat_link listener is registered');
      }

      if (!notifier.listenerCount('new_invitation')) {
        notifier.on('new_invitation', async record => {
          console.log('new_invitation', record);
          this.io
            .to(record.receiver_id)
            .emit(
              NEW_INVITATION,
              await chatutil.makeChatInviteNotification(record)
            );
        });
      }

      if (!notifier.listenerCount('set_invitation')) {
        notifier.on('set_invitation', async record => {
          // If there is no update time, then ignore.
          if (!record.updated_at) {
            return;
          }

          console.log('set_invitation', record);

          this.io
            .to(record.receiver_id)
            .emit(
              SET_INVITATION,
              await chatutil.makeChatInviteNotification(record)
            );
          this.io
            .to(record.sender_id)
            .emit(
              SET_INVITATION,
              await chatutil.makeChatInviteNotification(record)
            );
        });
      }

      if (!notifier.listenerCount('chat_created')) {
        notifier.on('chat_created', async chat => {
          console.log('chat_created', chat);
          this.io.to(chat.cohort_id).emit(CHAT_CREATED, {
            chat
          });
        });
      }

      if (!notifier.listenerCount('chat_ended')) {
        notifier.on('chat_ended', async chat => {
          console.log('chat_ended', chat);
          // This cannot be specifically bound to a room
          // created by CREATE_CHAT_CHANNEL, because it
          // needs to be accessible from cohort room selector
          this.io.emit(CHAT_ENDED, {
            chat
          });
        });
      }

      const sendRunResponseToAgent = async record => {
        const clientKey = `${record.run_id}-${record.user_id}-${record.response_id}`;

        // console.log('sendRunResponseToAgent, clientKey', clientKey);
        // console.log('sendRunResponseToAgent, record', record);
        // console.log(cache.clients[clientKey]);

        if (cache.clients[clientKey]) {
          const { client, auth } = cache.clients[clientKey];
          const { id, response_id, transcript = '', value = '' } = record;

          // console.log(auth);
          // console.log(record);

          if (value) {
            client.emit('request', {
              auth,
              id,
              response_id,
              transcript,
              value
            });

            await saveRunEvent(
              record.run_id,
              record.user_id,
              EVENT_TYPES.RESPONSE_SENT_TO_AGENT,
              record
            );
          }
        }
      };

      if (!notifier.listenerCount('agent_response_created')) {
        notifier.on('agent_response_created', async record => {
          console.log('agent_response_created', record);
          this.io.to(record.recipient_id).emit(AGENT_RESPONSE_CREATED, record);
        });
      }

      if (!notifier.listenerCount('run_response_created')) {
        notifier.on('run_response_created', async record => {
          console.log('run_response_created', record);
          sendRunResponseToAgent(record);
          const { run_id, response_id } = record;
          const chat = await runsdb.getChatByRunId(run_id);
          if (chat) {
            const room = `${chat.id}-response-${response_id}`;
            this.io.to(room).emit(SHARED_RESPONSE_CREATED, record);
            await saveRunEvent(
              record.run_id,
              record.user_id,
              EVENT_TYPES.SHARED_RESPONSE_CREATED,
              record
            );
          }
          this.io.to(record.user_id).emit(RUN_RESPONSE_CREATED, record);
        });
      }

      if (!notifier.listenerCount('run_response_updated')) {
        notifier.on('run_response_updated', async record => {
          console.log('run_response_updated', record);
          sendRunResponseToAgent(record);
          const { run_id, response_id } = record;
          const chat = await runsdb.getChatByRunId(run_id);
          if (chat) {
            const room = `${chat.id}-response-${response_id}`;
            this.io.to(room).emit(SHARED_RESPONSE_UPDATED, record);
            await saveRunEvent(
              record.run_id,
              record.user_id,
              EVENT_TYPES.SHARED_RESPONSE_UPDATED,
              record
            );
          }
          this.io.to(record.user_id).emit(RUN_RESPONSE_UPDATED, record);
        });
      }

      // if (!notifier.listenerCount('audio_transcript_created')) {
      //   notifier.on('audio_transcript_created', async record => {
      //     console.log('audio_transcript_created', record);
      //   });
      //   // console.log('chat_message_created listener is registered');
      // }

      // if (!notifier.listenerCount('audio_transcript_updated')) {
      //   notifier.on('audio_transcript_updated', async record => {
      //     console.log('audio_transcript_updated', record);
      //     // socket.broadcast.emit(CHAT_MESSAGE_UPDATED, record);
      //   });
      // }

      // Site
      socket.on(PING, () => {
        socket.emit(PONG);
      });

      // Currently unused
      // socket.on(CHAT_AGENT_PAUSE, async props => {
      //   console.log(CHAT_AGENT_PAUSE, props);
      // });

      socket.on(CHAT_AGENT_START, async payload => {
        console.log(CHAT_AGENT_START, payload);
        const { chat, prompt, run, user } = payload;

        if (payload.agent && payload.agent.id) {
          const room = `${chat.id}-user-${user.id}`;
          socket.join(room);

          const agent = await agentsdb.getAgent(payload.agent.id);
          const role = user.persona_id
            ? await personasdb.getPersonaById(user.persona_id)
            : null;
          const auth = makeRemoteSafeAuthPayload({
            agent,
            chat,
            user: {
              ...user,
              role
            }
          });

          console.log('CHAT_AGENT_START', auth);

          const options = {
            ...agent.socket,
            auth
          };

          if (cache.clients[room]) {
            cache.clients[room].client.disconnect();
          }

          const client = new Socket.Client(agent.endpoint, options);

          if (client) {
            await chatsdb.joinChat(chat.id, agent.self.id);
          }

          client.on('response', async response => {
            console.log('CHAT AGENT RESPONSE: ', response);
            if (!response.record || !response.record.chat_id) {
              // This is NOT a response to a chat message
              return;
            }
            await agentsdb.insertNewAgentResponse(
              // agent_id
              agent.id,
              // chat_id
              response.record.chat_id,
              // interaction_id
              agent.interaction.id,
              // prompt_response_id
              prompt.id,
              // recipient_id
              user.id,
              // response_id
              response.id,
              // run_id
              run.id,
              // response
              response
            );

            await saveRunEvent(
              run.id,
              user.id,
              EVENT_TYPES.AGENT_RESPONSE_RECEIVED,
              {
                ...payload,
                response
              }
            );
          });

          client.on('interjection', async response => {
            console.log('interjection', response.message);

            await chatsdb.insertNewAgentMessage(
              chat.id,
              agent.self.id, // This comes from the agent!!
              response.message,
              prompt.id,
              user.id // TODO: this should come from the interjection event
            );

            await saveRunEvent(
              run.id,
              user.id,
              EVENT_TYPES.AGENT_INTERJECTION_RECEIVED,
              {
                ...payload,
                response
              }
            );
          });

          cache.clients[room] = {
            client,
            auth
          };
        }
      });

      socket.on(CHAT_USER_AWAITING_MATCH, async props => {
        console.log(CHAT_USER_AWAITING_MATCH, props);
        const { cohort, persona, scenario, user } = props;

        const room = cohort.id
          ? `${cohort.id}-${scenario.id}-${persona.id}-${user.id}`
          : `${scenario.id}-${persona.id}-${user.id}`;

        socket.join(room);

        // This will return null until the the chat has
        // a complete set of participants.
        const chat = await chatsdb.joinOrCreateChatFromPool(
          cohort.id,
          scenario.id,
          persona.id,
          user.id
        );

        await saveUserEvent(user.id, EVENT_TYPES.USER_JOIN_POOL, props);

        if (chat) {
          for (let chatUser of chat.users) {
            const room = chat.cohort_id
              ? `${chat.cohort_id}-${chat.scenario_id}-${chatUser.persona_id}-${chatUser.id}`
              : `${chat.scenario_id}-${chatUser.persona_id}-${chatUser.id}`;

            this.io.to(room).emit(CHAT_USER_MATCHED, chat);
          }
        }
      });

      socket.on(CHAT_USER_CANCELED_MATCH_REQUEST, async props => {
        console.log(CHAT_USER_CANCELED_MATCH_REQUEST, props);
        const { cohort, persona, scenario, user } = props;
        await chatsdb.leaveChatPool(
          cohort.id,
          scenario.id,
          persona.id,
          user.id
        );

        await saveUserEvent(user.id, EVENT_TYPES.USER_PART_POOL, props);
      });

      socket.on(FACILITATOR_CREATED_MATCH_REQUEST, async props => {
        console.log(FACILITATOR_CREATED_MATCH_REQUEST, props);
        const { cohort, persona, scenario, user } = props;

        // Remove participant from pending roles that do not
        // match the persona being assigned.
        const personas = await scenariosdb.getScenarioPersonas(scenario.id);
        for (let { id } of personas) {
          if (id !== persona.id) {
            await chatsdb.leaveChatPool(cohort.id, scenario.id, id, user.id);
          }
        }

        const scenarioIdHash = Identity.toHash(scenario.id);
        const personaIdHash = Identity.toHash(persona.id);
        const cohortIdHash = cohort ? Identity.toHash(cohort.id) : null;
        let href = `/chat/join/${scenarioIdHash}/as/${personaIdHash}`;
        if (cohortIdHash) {
          href = `${href}/cohort/${cohortIdHash}`;
        }

        // This will be emitted directly to the user's own channel.
        this.io.to(user.id).emit(REDIRECT, {
          href
        });
      });

      socket.on(FACILITATOR_CANCELED_MATCH_REQUEST, async props => {
        console.log(FACILITATOR_CANCELED_MATCH_REQUEST, props);
        const { cohort, persona, scenario, user } = props;
        await chatsdb.leaveChatPool(
          cohort.id,
          scenario.id,
          persona.id,
          user.id
        );

        await saveUserEvent(user.id, EVENT_TYPES.USER_PART_POOL, props);

        const room = cohort.id
          ? `${cohort.id}-${scenario.id}-${persona.id}-${user.id}`
          : `${scenario.id}-${persona.id}-${user.id}`;

        this.io.to(room).emit(FACILITATOR_CANCELED_MATCH_REQUEST);
      });

      socket.on(RUN_AGENT_START, async payload => {
        const { run, user } = payload;
        console.log(RUN_AGENT_START, { run, user });
        const prompts = await agentsdb.getScenarioAgentPrompts(run.scenario_id);

        for (const prompt of prompts) {
          const { agent } = prompt;

          if (agent && agent.id) {
            const room = `${run.id}-${run.user_id}-${prompt.response_id}`;
            socket.join(room);

            const auth = makeRemoteSafeAuthPayload({ agent, run, user });
            const options = {
              ...agent.socket,
              auth
            };

            if (cache.clients[room]) {
              cache.clients[room].client.disconnect();
            }

            const client = new Socket.Client(agent.endpoint, options);

            client.on('response', async response => {
              console.log('RUN AGENT RESPONSE: ', response);
              if (response.record && response.record.chat_id) {
                // This is a response to a chat message,
                // not a regular prompt component
                return;
              }
              await agentsdb.insertNewAgentResponse(
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

              await saveRunEvent(
                run.id,
                user.id,
                EVENT_TYPES.AGENT_RESPONSE_RECEIVED,
                {
                  ...payload,
                  response
                }
              );
            });

            cache.clients[room] = {
              client,
              auth
            };
          }
        }
      });

      socket.on(RUN_AGENT_END, async ({ agent, run, user }) => {
        console.log(RUN_AGENT_END, { agent, run, user });
        // socket.join(user.id);

        // const agents = await agentsdb.getScenarioAgents(run.scenario_id);

        // console.log(agents);
      });

      socket.on(CREATE_SHARED_RESPONSE_CHANNEL, ({ chat, response }) => {
        console.log(CREATE_SHARED_RESPONSE_CHANNEL, { chat, response });
        socket.join(`${chat.id}-response-${response.id}`);
      });

      socket.on(CREATE_USER_CHANNEL, ({ user }) => {
        if (user && user.id) {
          console.log(CREATE_USER_CHANNEL, { user });
          socket.join(user.id);
        }
      });

      socket.on(CREATE_CHAT_CHANNEL, ({ chat }) => {
        if (chat && chat.id) {
          console.log(CREATE_CHAT_CHANNEL, { chat });
          socket.join(chat.id);
        }
      });

      socket.on(CREATE_CHAT_SLIDE_CHANNEL, async ({ chat, slide }) => {
        console.log(CREATE_CHAT_SLIDE_CHANNEL, { chat, slide });
        const room = `${chat.id}-slide-${slide.index}`;
        socket.join(room);

        let state = await db.getDiscussionState(room);

        if (!state) {
          state = CHAT_IS_PENDING;
        }

        this.io.to(room).emit(CHAT_STATE, { chat, slide, state });

        await db.setDiscussionState(room, CHAT_IS_PENDING);

        console.log(CHAT_STATE, room, { chat, slide, state });
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
        if (id) {
          authdb.updateUser(id, {
            lastseen_at: new Date().toISOString()
          });
        }
      });

      // Chat
      socket.on(USER_TYPING, payload => {
        this.io.to(payload.chat.id).emit(USER_TYPING_UPDATE, payload);
      });

      socket.on(USER_JOIN, async ({ chat, user }) => {
        console.log(USER_JOIN, { chat, user });
        const chatUser = await chatsdb.getChatUserByChatId(chat.id, user.id);
        chatsdb.joinChat(chat.id, user.id, chatUser.persona_id);
      });

      socket.on(USER_JOIN_SLIDE, async ({ chat, user, scenario, run }) => {
        console.log(USER_JOIN_SLIDE, chat, user, run);

        if (run) {
          const message = run.activeRunSlideIndex
            ? `is on slide #${run.activeRunSlideIndex}`
            : null;

          if (!message) {
            return;
          }

          await chatsdb.updateJoinPartMessages(chat.id, user.id, {
            deleted_at: new Date().toISOString()
          });

          await chatsdb.insertNewJoinPartMessage(chat.id, user.id, message);

          const rollKey = `${chat.id}-slide-${run.activeRunSlideIndex}`;

          // Remove the user from all other  rosters.
          await db.removeUserFromRolls(user.id);

          // Add them to this roster (unique)
          await db.addUserToRoll(rollKey, user.id);
          const roll = await db.getRollCallByRoomKey(rollKey);

          const personas = await scenariosdb.getScenarioPersonas(scenario.id);
          const users = await chatsdb.getLinkedChatUsersByChatId(chat.id);
          const isCompleteRoll = users.every(({ id }) => roll.includes(id));

          const personaIds = personas.map(({ id }) => id);
          const allUsersHavePersonas = users.every(({ persona_id }) =>
            personaIds.includes(persona_id)
          );
          const allPersonasHaveUsers = personaIds.every(persona_id =>
            users.some(user => user.persona_id === persona_id)
          );

          const isCompleteRoster = allUsersHavePersonas && allPersonasHaveUsers;
          // isCompleteRoll: All users are on the same slide
          // isCompleteRoster: All expected roles are filled by users
          const quorum = isCompleteRoll && isCompleteRoster;

          if (quorum) {
            // const room = `${chat.id}-user-${chat.host_id}`;
            // this.io.to(room).emit(CHAT_QUORUM_FOR_SLIDE, {
            //   chat,
            //   user: {
            //     id: chat.host_id
            //   }
            // });
            const state = CHAT_IS_ACTIVE;
            await db.setDiscussionState(rollKey, state);

            this.io.to(rollKey).emit(CHAT_STATE, {
              chat,
              slide: {
                index: run.activeRunSlideIndex
              },
              state
            });
          }

          await saveRunEvent(run.id, user.id, EVENT_TYPES.USER_JOIN_SLIDE, {
            chat,
            user,
            scenario,
            run
          });
        }
      });

      socket.on(USER_PART_SLIDE, async ({ chat, user, run }) => {
        console.log(USER_PART_SLIDE, chat, user, run);

        if (run) {
          await db.removeUserFromRolls(user.id);
          await saveRunEvent(run.id, user.id, EVENT_TYPES.USER_PART_SLIDE, {
            chat,
            user,
            run
          });
        }
      });

      socket.on(USER_PART, ({ chat, user }) => {
        chatsdb.partChat(chat.id, user.id);
      });

      socket.on(CHAT_MESSAGE_CREATED, async payload => {
        const { chat, user, content, prompt, run } = payload;
        console.log({ chat, user, content, prompt, run });
        chatsdb.createNewChatMessage(chat.id, user.id, content, prompt.id);

        if (run) {
          await saveRunEvent(
            run.id,
            user.id,
            EVENT_TYPES.CHAT_MESSAGE_CREATED,
            {
              ...payload
            }
          );
        }
      });

      socket.on(CHAT_CLOSED_FOR_SLIDE, async payload => {
        const { chat, user, slide, result, run } = payload;
        console.log(CHAT_CLOSED_FOR_SLIDE, { chat, user, slide, result, run });
        const room = `${chat.id}-slide-${slide.index}`;

        // cache.rollCalls.delete(room);
        // db.removeRollCallByRoomKey(room);

        if (cache.timers[room]) {
          clearInterval(cache.timers[room]);
          cache.timers[room] = null;
        }

        this.io.to(room).emit(TIMER_END, {
          chat,
          user,
          slide,
          result
        });

        this.io.to(room).emit(CHAT_CLOSED_FOR_SLIDE, {
          chat,
          slide,
          result
        });

        await db.setDiscussionState(room, closeResultToStateMap[result]);

        if (run) {
          await saveRunEvent(
            run.id,
            user.id,
            EVENT_TYPES.CHAT_CLOSED_FOR_SLIDE,
            {
              ...payload
            }
          );
        }

        socket.leave(room);
      });

      socket.on(TIMER_START, async ({ chat, user, slide, timeout }) => {
        console.log(TIMER_START, { chat, user, slide, timeout });
        const room = `${chat.id}-slide-${slide.index}`;

        socket.join(room);

        // Only one node needs to cache the timer since we
        // emit these events to this.io.to(room), of which
        // broadcast is handled by the redis adapter
        if (!cache.timers[room]) {
          cache.timers[room] = setInterval(() => {
            timeout--;

            // Intentionally using this.io here, instead of
            // socket, to ensure that all clients recieve
            // these ticks. Using socket will omit the sending
            // socket from the list of recipients.
            this.io.to(room).emit(TIMER_TICK, {
              timeout
            });
            if (!timeout) {
              clearInterval(cache.timers[room]);
              cache.timers[room] = null;
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

        this.io.to(room).emit(TIMER_START, {
          chat,
          user,
          slide,
          timeout
        });
      });
    });
  }
}

module.exports = SocketManager;
