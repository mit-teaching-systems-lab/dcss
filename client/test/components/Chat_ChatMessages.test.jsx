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

let user;
let superUser;
let chatUsers;
let chat;
let chats;
let chatsById;
let message1;
let message2;
let message3;
let message4;
let message5;
let messages;

const expectDateString = expect.stringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}.*/i);

import ChatMessages from '../../components/Chat/ChatMessages.jsx';
/** @GENERATED: END **/

const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  /** @GENERATED: BEGIN **/

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

  chat = {
    id: 1,
    scenario_id: 42,
    cohort_id: null,
    host_id: 999,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    users: chatUsers
  };

  chats = [chats];

  chatsById = chats.reduce((accum, chat) => {
    accum[chat.id] = chat;
    return accum;
  });

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

  messages = [message1, message2, message3, message4, message5];

  chatActions.getChatById.mockImplementation(() => async dispatch => {
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

  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
});

test('ChatMessages', () => {
  expect(ChatMessages).toBeDefined();
});

test('Render 1 1', async done => {
  /** @GENERATED: BEGIN **/
  const Component = ChatMessages;
  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  /** @GENERATED: END **/

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

/* INJECTION STARTS HERE */

test('Message count is 0', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('User is missing from chat.usersById', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(asFragment()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives message that was deleted', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(asFragment()).toMatchSnapshot();

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
  expect(asFragment()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives new message at end of messages', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(asFragment()).toMatchSnapshot();

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
  expect(asFragment()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives new message, user does not exist yet.', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(asFragment()).toMatchSnapshot();

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
  expect(asFragment()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();
  expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();

  done();
});

test('Receives new message after scrolling', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(asFragment()).toMatchSnapshot();

  const scrollingContainerOuter = await screen.findByTestId(
    'scrolling-container-outer'
  );

  fireEvent.scroll(scrollingContainerOuter, { target: { scrollY: -200 } });
  expect(asFragment()).toMatchSnapshot();

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
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(seeNewMessage);

  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Show hidden messages', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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
  const { asFragment, container } = rendered;
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);

  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();

  expect(asFragment()).toMatchSnapshot();

  expect((await screen.findAllByTestId('comment')).length).toBe(20);
  expect(screen.queryByLabelText('See more messages')).not.toBe(null);

  userEvent.click(await screen.findByLabelText('See more messages'));

  expect((await screen.findAllByTestId('comment')).length).toBe(30);

  userEvent.click(await screen.findByLabelText('See more messages'));

  expect((await screen.findAllByTestId('comment')).length).toBe(40);

  userEvent.click(await screen.findByLabelText('See more messages'));

  expect((await screen.findAllByTestId('comment')).length).toBe(50);

  userEvent.click(await screen.findByLabelText('See more messages'));

  expect((await screen.findAllByTestId('comment')).length).toBe(60);

  userEvent.click(await screen.findByLabelText('See more messages'));

  expect((await screen.findAllByTestId('comment')).length).toBe(70);

  userEvent.click(await screen.findByLabelText('See more messages'));

  expect((await screen.findAllByTestId('comment')).length).toBe(80);

  userEvent.click(await screen.findByLabelText('See more messages'));

  expect((await screen.findAllByTestId('comment')).length).toBe(90);

  userEvent.click(await screen.findByLabelText('See more messages'));

  expect((await screen.findAllByTestId('comment')).length).toBe(100);

  // The button should no longer be visible!!
  expect(screen.queryByLabelText('See more messages')).toBe(null);

  done();
});

test('Receives new message after scrolling without existing messages', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(asFragment()).toMatchSnapshot();

  const scrollingContainerOuter = await screen.findByTestId(
    'scrolling-container-outer'
  );

  fireEvent.scroll(scrollingContainerOuter, { target: { scrollY: -200 } });
  expect(asFragment()).toMatchSnapshot();

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
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(seeNewMessage);

  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Receives new message for different chat', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(screen.queryAllByTestId('comment').length).toBe(11);
  expect(asFragment()).toMatchSnapshot();

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
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Receives new message just before unmount', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment, unmount } = render(
    <ConnectedRoutedComponent {...props} />
  );
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(screen.queryAllByTestId('comment').length).toBe(11);
  expect(asFragment()).toMatchSnapshot();

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
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Calls onQuote', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {}),
    onQuote: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(screen.queryAllByTestId('comment').length).toBe(4);
  expect(asFragment()).toMatchSnapshot();

  const quotables = await screen.findAllByLabelText('Quote this message');

  quotables.forEach(quotable => userEvent.click(quotable));

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
    ...(commonProps || {}),
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(screen.queryAllByTestId('comment').length).toBe(2);
  expect(asFragment()).toMatchSnapshot();

  expect(screen.queryAllByLabelText('Delete this message').length).toBe(1);

  const deletable = await screen.findByLabelText('Delete this message');

  userEvent.click(deletable);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /No/i }));
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(deletable);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/i }));
  expect(asFragment()).toMatchSnapshot();

  await waitFor(() => expect(chatActions.setMessageById).toHaveBeenCalled());
  expect(chatActions.setMessageById.mock.calls[0][0]).toBe(6);
  expect(chatActions.setMessageById.mock.calls[0][1]).toMatchObject({
    deleted_at: expectDateString
  });

  expect(screen.queryAllByTestId('comment').length).toBe(1);

  done();
});

test('Does a corrective scroll when view is resized', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  globalThis.onResize();

  await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());

  done();
});

test('Receives new message, user missing (unloaded)', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment, unmount } = render(
    <ConnectedRoutedComponent {...props} />
  );
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(screen.queryAllByTestId('comment').length).toBe(11);
  expect(asFragment()).toMatchSnapshot();

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
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Receives deleted message', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(asFragment()).toMatchSnapshot();

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
  expect(asFragment()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives updated message', async done => {
  const Component = ChatMessages;

  const props = {
    ...(commonProps || {})
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

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
    ]
  `);
  expect(asFragment()).toMatchSnapshot();

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
  expect(asFragment()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});
