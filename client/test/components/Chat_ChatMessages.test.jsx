/** @TEMPLATE: BEGIN **/
import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect
}));

import {
  fetchImplementation,
  mounter,
  reduxer,
  serialize,
  snapshotter,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import {
  act,
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

async function waitForPopper() {
  // Popper update() - https://github.com/popperjs/react-popper/issues/350
  await act(async () => await null);
}

/** @TEMPLATE: END **/

/** @GENERATED: BEGIN **/

import Emitter from 'events';

import * as UI from '@components/UI';
jest.mock('@components/UI', () => {
  function ResizeDetector({ children, onResize }) {
    globalThis.onResize = onResize;
    return children;
  }
  return {
    __esModule: true,
    ...jest.requireActual('@components/UI'),
    ResizeDetector
  };
});

import scrollIntoView from '@utils/scrollIntoView';
jest.mock('@utils/scrollIntoView', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {})
  };
});

import withSocket, * as SOCKET_EVENT_TYPES from '@hoc/withSocket';
jest.mock('@hoc/withSocket', () => {
  const socket = {
    disconnect: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  };

  globalThis.mockSocket = socket;

  return {
    __esModule: true,
    ...jest.requireActual('@hoc/withSocket'),
    default: function(Component) {
      Component.defaultProps = {
        ...Component.defaultProps,
        socket
      };
      return Component;
    }
  };
});

jest.mock('@utils/Moment', () => {
  return {
    __esModule: true,
    default: function(time) {
      return {
        format() {
          return 'HH:mm A';
        }
      };
    }
  };
});

import {
  GET_CHAT_ERROR,
  GET_CHAT_SUCCESS,
  GET_CHAT_MESSAGES_ERROR,
  GET_CHAT_MESSAGES_SUCCESS,
  GET_CHAT_MESSAGES_COUNT_ERROR,
  GET_CHAT_MESSAGES_COUNT_SUCCESS,
  GET_CHAT_USERS_ERROR,
  GET_CHAT_USERS_SUCCESS,
  GET_CHATS_ERROR,
  GET_CHATS_SUCCESS,
  GET_USER_SUCCESS,
  SET_CHAT_ERROR,
  SET_CHAT_SUCCESS,
  SET_CHAT_MESSAGE_SUCCESS,
  SET_CHAT_USERS_SUCCESS,
  LINK_RUN_TO_CHAT_ERROR,
  LINK_RUN_TO_CHAT_SUCCESS
} from '../../actions/types';
import * as chatActions from '../../actions/chat';
import * as userActions from '../../actions/user';
jest.mock('../../actions/chat');
jest.mock('../../actions/user');

let agent;
let user;
let superUser;
let chatUsers;
let chatUsersById;
let chat;
let chats;
let chatsById;
let message1;
let message2;
let message3;
let message4;
let message5;
let message6;
let message7;
let messages;
let scenario;

const expectDateString = expect.stringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}.*/i);

import ChatMessages from '../../components/Chat/ChatMessages.jsx';
/** @GENERATED: END **/

/** @TEMPLATE: BEGIN **/
const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;
/** @TEMPLATE: END **/

beforeAll(() => {
  /** @TEMPLATE: BEGIN **/
  (window || global).fetch = jest.fn();
  /** @TEMPLATE: END **/
});

afterAll(() => {
  /** @TEMPLATE: BEGIN **/
  jest.restoreAllMocks();
  /** @TEMPLATE: END **/
});

beforeEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.useFakeTimers();
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);
  /** @TEMPLATE: END **/

  /** @GENERATED: BEGIN **/

  scenario = {
    author: {
      id: 999,
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      is_anonymous: false,
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true
    },
    categories: [],
    consent: { id: 57, prose: '' },
    description: "This is the description of 'A Multiplayer Scenario'",
    finish: {
      id: 1,
      title: '',
      components: [
        { html: '<h2>Thanks for participating!</h2>', type: 'Text' }
      ],
      is_finish: true
    },
    lock: {
      scenario_id: 42,
      user_id: 999,
      created_at: '2020-02-31T23:54:19.934Z',
      ended_at: null
    },
    slides: [
      {
        id: 1,
        title: '',
        components: [
          { html: '<h2>Thanks for participating!</h2>', type: 'Text' }
        ],
        is_finish: true
      },
      {
        id: 2,
        title: '',
        components: [
          {
            id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
            html: '<p>paragraph</p>',
            type: 'Text'
          },
          {
            agent: null,
            id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: ''
          },
          {
            id: 'f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html: '<p>?</p>',
            type: 'Text'
          }
        ],
        is_finish: false
      }
    ],
    status: 1,
    title: 'Multiplayer Scenario 2',
    users: [
      {
        id: 999,
        email: 'super@email.com',
        username: 'super',
        personalname: 'Super User',
        roles: ['super'],
        is_super: true,
        is_author: true,
        is_reviewer: false
      }
    ],
    id: 42,
    created_at: '2020-08-31T17:50:28.089Z',
    updated_at: null,
    deleted_at: null,
    labels: ['a', 'b'],
    personas: [
      {
        id: 1,
        name: 'Participant',
        description:
          'The default user participating in a single person scenario.',
        color: '#FFFFFF',
        created_at: '2020-12-01T15:49:04.962Z',
        updated_at: null,
        deleted_at: null,
        author_id: 3,
        is_read_only: true,
        is_shared: true
      }
    ]
  };
  scenario.personas = [
    {
      id: 2,
      name: 'Teacher',
      description:
        'A non-specific teacher, participating in a multi person scenario.',
      color: '#3f59a9',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    },
    {
      id: 3,
      name: 'Student',
      description:
        'A non-specific student, participating in a multi person scenario.',
      color: '#e59235',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    }
  ];

  agent = {
    id: 1,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: '2021-02-25T20:09:04.999Z',
    deleted_at: null,
    is_active: true,
    title: 'Emoji Analysis',
    name: 'emoji-analysis',
    description: 'Detects the presense of an emoji character in your text',
    endpoint: 'ws://emoji-analysis-production.herokuapp.com',
    configuration: {
      bar: '2',
      baz: 'c',
      foo: 'false'
    },
    interaction: {
      id: 1,
      name: 'ChatPrompt',
      description:
        'It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.',
      created_at: '2021-02-25T15:09:05.001302-05:00',
      deleted_at: null,
      updated_at: null,
      types: []
    },
    owner: {
      id: 999,
      email: 'super@email.com',
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true,
      username: 'superuser',
      is_anonymous: false,
      personalname: 'Super User'
    },
    self: {
      id: 148,
      email: null,
      roles: null,
      is_super: false,
      username: 'ebe565050b31cbb4e7eacc39b23e2167',
      lastseen_at: '2021-02-25T13:08:57.323-05:00',
      is_anonymous: true,
      personalname: 'Emoji Analysis',
      single_use_password: false
    },
    socket: {
      path: '/path/to/foo'
    }
  };

  user = superUser = {
    username: 'super',
    personalname: 'Super User',
    email: 'super@email.com',
    id: 999,
    roles: ['participant', 'super_admin'],
    is_anonymous: false,
    is_super: true
  };

  chatUsers = [
    superUser,
    {
      id: 4,
      username: 'credible-lyrebird',
      personalname: null,
      email: null,
      is_anonymous: true,
      single_use_password: false,
      roles: ['participant', 'facilitator'],
      is_super: false,
      updated_at: '2020-12-10T17:50:19.074Z',
      is_muted: false,
      is_present: true
    }
  ];

  chatUsersById = chatUsers.reduce((accum, chatUser) => {
    accum[chatUser.id] = chatUser;
    return accum;
  }, {});

  chat = {
    id: 1,
    scenario_id: 42,
    cohort_id: null,
    host_id: 999,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    users: chatUsers,
    usersById: chatUsersById
  };

  chats = [chat];

  chatsById = chats.reduce((accum, chat) => {
    accum[chat.id] = chat;
    return accum;
  }, {});

  message1 = {
    chat_id: 1,
    content: '<p>Hello</p>',
    created_at: '2020-12-09T16:39:10.359Z',
    deleted_at: null,
    id: 6,
    is_quotable: true,
    updated_at: null,
    user_id: 999
  };

  message2 = {
    chat_id: 1,
    content:
      '<p><span style="color: rgb(140, 140, 140);"><em>has joined the chat.</em></span><br></p>',
    created_at: '2020-12-09T16:40:10.359Z',
    deleted_at: null,
    id: 7,
    is_quotable: false,
    is_joinpart: true,
    updated_at: null,
    user_id: 4
  };

  message3 = {
    chat_id: 1,
    content: '<p>Hi!</p>',
    created_at: '2020-12-09T16:40:10.359Z',
    deleted_at: null,
    id: 8,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  };

  message4 = {
    chat_id: 1,
    content:
      '<p><span style="color: rgb(140, 140, 140);"><em>has left the chat.</em></span><br></p>',
    created_at: '2020-12-09T16:41:10.359Z',
    deleted_at: null,
    id: 9,
    is_quotable: false,
    updated_at: null,
    user_id: 4
  };

  message5 = {
    chat_id: 1,
    content: '<p>This is treated as deleted</p>',
    created_at: '2020-12-09T16:41:10.359Z',
    deleted_at: '2020-12-09T16:44:10.359Z',
    id: 10,
    is_quotable: false,
    updated_at: null,
    user_id: 999
  };

  message6 = {
    chat_id: 1,
    content: '<p>user and recipient are the same</p>',
    created_at: '2020-12-09T16:41:10.359Z',
    deleted_at: '2020-12-09T16:44:10.359Z',
    id: 10,
    is_quotable: false,
    updated_at: null,
    user_id: 999,
    recipient_id: 999
  };

  message7 = {
    chat_id: 1,
    content:
      '<p>user and recipient are the same, but not the same viewing user</p>',
    created_at: '2020-12-09T16:41:10.359Z',
    deleted_at: '2020-12-09T16:44:10.359Z',
    id: 10,
    is_quotable: false,
    updated_at: null,
    user_id: 4,
    recipient_id: 4
  };

  messages = [
    message1,
    message2,
    message3,
    message4,
    message5,
    message6,
    message7
  ];

  chatActions.getChat.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChatByIdentifiers.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    const users = chatUsers;
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  chatActions.setMessageById.mockImplementation(
    (id, params) => async dispatch => {
      const messageIndex = messages.findIndex(message => message.id === id);
      const message = {
        ...messages[messageIndex],
        ...params
      };
      dispatch({ type: SET_CHAT_MESSAGE_SUCCESS, message });
      return message;
    }
  );

  /** @GENERATED: END **/

  /** @TEMPLATE: BEGIN **/
  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
  /** @TEMPLATE: END **/
});

afterEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
  /** @TEMPLATE: END **/
});

test('ChatMessages', () => {
  expect(ChatMessages).toBeDefined();
});

/* INJECTION STARTS HERE */

test('Chat has an agent', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    agent,
    chat
  };

  const state = {
    ...commonState
  };
  const ConnectedRoutedComponent = reduxer(Component, props, state);
  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-agent-start",
        Object {
          "agent": Object {
            "configuration": Object {
              "bar": "2",
              "baz": "c",
              "foo": "false",
            },
            "created_at": "2021-02-25T17:31:33.826Z",
            "deleted_at": null,
            "description": "Detects the presense of an emoji character in your text",
            "endpoint": "ws://emoji-analysis-production.herokuapp.com",
            "id": 1,
            "interaction": Object {
              "created_at": "2021-02-25T15:09:05.001302-05:00",
              "deleted_at": null,
              "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
              "id": 1,
              "name": "ChatPrompt",
              "types": Array [],
              "updated_at": null,
            },
            "is_active": true,
            "name": "emoji-analysis",
            "owner": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "participant",
                "super_admin",
                "facilitator",
                "researcher",
              ],
              "username": "superuser",
            },
            "self": Object {
              "email": null,
              "id": 148,
              "is_anonymous": true,
              "is_super": false,
              "lastseen_at": "2021-02-25T13:08:57.323-05:00",
              "personalname": "Emoji Analysis",
              "roles": null,
              "single_use_password": false,
              "username": "ebe565050b31cbb4e7eacc39b23e2167",
            },
            "socket": Object {
              "path": "/path/to/foo",
            },
            "title": "Emoji Analysis",
            "updated_at": "2021-02-25T20:09:04.999Z",
          },
          "chat": Object {
            "host_id": 999,
            "id": 1,
          },
          "cohort": Object {
            "id": 2,
          },
          "prompt": undefined,
          "response": Object {
            "id": undefined,
          },
          "run": null,
          "url": "http://localhost/",
          "user": Object {
            "email": null,
            "id": null,
            "is_anonymous": false,
            "is_super": true,
            "personalname": null,
            "roles": Array [],
            "username": null,
          },
        },
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Message count is 0 (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = 0;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Message count is 0 (chat in state)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    chat
  };

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = 0;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('User is missing from chat.usersById (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat: {
      ...chat,
      usersById: {
        999: chatUsers[0]
      }
    }
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('User is missing from chat.usersById (chat in state)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    chat: {
      ...chat,
      usersById: {
        999: chatUsers[0]
      }
    }
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives message that was deleted', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    user: superUser
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: '<p>A deleted message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: '2020-12-15T10:40:10.359Z',
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(11)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives new message at end of messages (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState,
    scenario
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(12)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives new message at end of messages (chat in state)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    chat
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(12)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives new message, user does not exist yet.', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    const users = [
      ...chatUsers,
      {
        id: 5,
        username: 'another-user',
        personalname: null,
        email: null,
        is_anonymous: true,
        single_use_password: false,
        roles: ['participant'],
        is_super: false,
        updated_at: '2020-12-10T17:50:19.074Z',
        is_muted: false,
        is_present: true
      }
    ];
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 5
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(12)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();
  expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();

  done();
});

test('Receives new message, user does not exist yet. (chat in state)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    chat
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    const users = [
      ...chatUsers,
      {
        id: 5,
        username: 'another-user',
        personalname: null,
        email: null,
        is_anonymous: true,
        single_use_password: false,
        roles: ['participant'],
        is_super: false,
        updated_at: '2020-12-10T17:50:19.074Z',
        is_muted: false,
        is_present: true
      }
    ];
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 5
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(12)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();
  expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();

  done();
});

test('Receives new message after scrolling (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  const scrollingContainerOuter = await screen.findByTestId(
    'scrolling-container-outer'
  );

  fireEvent.scroll(scrollingContainerOuter, { target: { scrollY: -200 } });
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(12)
  );

  const seeNewMessage = await screen.findByLabelText('See new message');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(seeNewMessage);
  await waitForPopper();

  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Receives new message after scrolling (chat in state)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    chat
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  const scrollingContainerOuter = await screen.findByTestId(
    'scrolling-container-outer'
  );

  fireEvent.scroll(scrollingContainerOuter, { target: { scrollY: -200 } });
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(12)
  );

  const seeNewMessage = await screen.findByLabelText('See new message');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(seeNewMessage);
  await waitForPopper();

  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Show hidden messages (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const messages = Array.from({ length: 100 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const rendered = render(<ConnectedRoutedComponent {...props} />);
  const { container } = rendered;
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);

  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();

  expect(serialize()).toMatchSnapshot();

  expect((await screen.findAllByTestId('comment')).length).toBe(20);
  expect(screen.queryByLabelText('See more messages')).not.toBe(null);

  userEvent.click(await screen.findByLabelText('See more messages'));
  await waitForPopper();

  expect((await screen.findAllByTestId('comment')).length).toBe(30);

  userEvent.click(await screen.findByLabelText('See more messages'));
  await waitForPopper();

  expect((await screen.findAllByTestId('comment')).length).toBe(40);

  userEvent.click(await screen.findByLabelText('See more messages'));
  await waitForPopper();

  expect((await screen.findAllByTestId('comment')).length).toBe(50);

  userEvent.click(await screen.findByLabelText('See more messages'));
  await waitForPopper();

  expect((await screen.findAllByTestId('comment')).length).toBe(60);

  userEvent.click(await screen.findByLabelText('See more messages'));
  await waitForPopper();

  expect((await screen.findAllByTestId('comment')).length).toBe(70);

  userEvent.click(await screen.findByLabelText('See more messages'));
  await waitForPopper();

  expect((await screen.findAllByTestId('comment')).length).toBe(80);

  userEvent.click(await screen.findByLabelText('See more messages'));
  await waitForPopper();

  expect((await screen.findAllByTestId('comment')).length).toBe(90);

  userEvent.click(await screen.findByLabelText('See more messages'));
  await waitForPopper();

  expect((await screen.findAllByTestId('comment')).length).toBe(100);

  // The button should no longer be visible!!
  expect(screen.queryByLabelText('See more messages')).toBe(null);

  done();
});

test('Receives new message, has props.onMessageReceived', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat,
    onMessageReceived: jest.fn()
  };

  const state = {
    ...commonState
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = [];

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(1)
  );

  expect(props.onMessageReceived).toHaveBeenCalled();

  done();
});

test('Receives new message after scrolling without existing messages (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = [];

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  const scrollingContainerOuter = await screen.findByTestId(
    'scrolling-container-outer'
  );

  fireEvent.scroll(scrollingContainerOuter, { target: { scrollY: -200 } });
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(1)
  );

  const seeNewMessage = await screen.findByLabelText('See new message');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(seeNewMessage);
  await waitForPopper();

  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Receives new message for different chat (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(screen.queryAllByTestId('comment').length).toBe(11);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 2,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(11)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Receives updated message for different chat (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(screen.queryAllByTestId('comment').length).toBe(11);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-updated', {
    chat_id: 2,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(11)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Receives new message just before unmount (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { unmount } = render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(screen.queryAllByTestId('comment').length).toBe(11);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  unmount();

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(0)
  );
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Calls onQuote', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    onQuote: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(screen.queryAllByTestId('comment').length).toBe(4);
  expect(serialize()).toMatchSnapshot();

  const quotables = await screen.findAllByLabelText('Quote this message');

  quotables.forEach(quotable => userEvent.click(quotable));
  await waitForPopper();

  expect(props.onQuote).toHaveBeenCalledTimes(2);
  expect(props.onQuote.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "chat_id": 1,
          "content": "<p>Hello</p>",
          "created_at": "2020-12-09T16:39:10.359Z",
          "deleted_at": null,
          "id": 6,
          "is_quotable": true,
          "updated_at": null,
          "user_id": 999,
        },
      ],
      Array [
        Object {
          "chat_id": 1,
          "content": "<p>Hi!</p>",
          "created_at": "2020-12-09T16:40:10.359Z",
          "deleted_at": null,
          "id": 8,
          "is_quotable": true,
          "updated_at": null,
          "user_id": 4,
        },
      ],
    ]
  `);

  done();
});

test('Message can be deleted', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    onDelete: jest.fn()
  };

  const state = {
    ...commonState,
    user: superUser
  };

  const messages = [
    {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: 6,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    },
    {
      chat_id: 1,
      content:
        '<p><span style="color: rgb(140, 140, 140);"><em>has joined the chat.</em></span><br></p>',
      created_at: '2020-12-09T16:40:10.359Z',
      deleted_at: null,
      id: 7,
      is_quotable: false,
      updated_at: null,
      user_id: 4
    }
  ];

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(screen.queryAllByTestId('comment').length).toBe(2);
  expect(serialize()).toMatchSnapshot();

  expect(screen.queryAllByLabelText('Delete this message').length).toBe(1);

  const deletable = await screen.findByLabelText('Delete this message');

  userEvent.click(deletable);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /No/i }));
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(deletable);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/i }));
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(chatActions.setMessageById).toHaveBeenCalled());
  expect(chatActions.setMessageById.mock.calls[0][0]).toBe(6);
  expect(chatActions.setMessageById.mock.calls[0][1]).toMatchObject({
    deleted_at: expectDateString
  });

  expect(screen.queryAllByTestId('comment').length).toBe(1);

  done();
});

test('Does a corrective scroll when view is resized (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  globalThis.onResize();

  await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());

  done();
});

test('Receives new message, user missing (unloaded) (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { unmount } = render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(screen.queryAllByTestId('comment').length).toBe(11);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 9001
  });

  unmount();

  await waitFor(() =>
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled()
  );
  expect(chatActions.getChatUsersByChatId.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Receives deleted message (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-updated', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: '2020-12-15T09:40:10.359Z',
    id: 0,
    is_quotable: true,
    updated_at: '2020-12-15T09:40:10.359Z',
    user_id: 4
  });

  await waitFor(() =>
    // 11 - 1 newly deleted message
    expect(screen.queryAllByTestId('comment').length).toBe(10)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives deleted message (chat in state)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    chat
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-updated', {
    chat_id: 1,
    content: '<p>A new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: '2020-12-15T09:40:10.359Z',
    id: 0,
    is_quotable: true,
    updated_at: '2020-12-15T09:40:10.359Z',
    user_id: 4
  });

  await waitFor(() =>
    // 11 - 1 newly deleted message
    expect(screen.queryAllByTestId('comment').length).toBe(10)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives updated message (chat in props)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-updated', {
    chat_id: 1,
    content: '<p>a new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: 0,
    is_quotable: true,
    updated_at: '2020-12-15T09:40:10.359Z',
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(11)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives updated message (chat in state)', async done => {
  const Component = ChatMessages;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    chat
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const messages = Array.from({ length: 11 }, (v, i) => {
    return {
      chat_id: 1,
      content: '<p>Hello</p>',
      created_at: '2020-12-09T16:39:10.359Z',
      deleted_at: null,
      id: i,
      is_quotable: true,
      updated_at: null,
      user_id: 999
    };
  });

  chatActions.getChatMessagesByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
      return messages;
    }
  );

  chatActions.getChatMessagesCountByChatId.mockImplementation(
    () => async dispatch => {
      const count = messages.length;
      dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
      return count;
    }
  );

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "chat-message-updated",
        [Function],
      ],
      Array [
        "user-typing-update",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-updated', {
    chat_id: 1,
    content: '<p>a new message</p>',
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: 0,
    is_quotable: true,
    updated_at: '2020-12-15T09:40:10.359Z',
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(11)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});
