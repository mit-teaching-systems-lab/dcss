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

import Emitter from 'events';

import Storage from '@utils/Storage';
jest.mock('@utils/Storage', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@utils/Storage')
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

import RichTextEditor from '@components/RichTextEditor';
globalThis.onChange = jest.fn();
globalThis.rte = {
  setContents: jest.fn(),
  core: {
    focus: jest.fn()
  }
};

jest.mock('@components/RichTextEditor', () => {
  return function(props) {
    const mode = props.mode || 'editor';
    const __html = props.defaultValue;
    const className = props.className;

    if (mode === 'editor') {
      const rte = {
        ...globalThis.rte
      };
      const {
        name = 'content',
        id,
        customPlugins,
        disable = true,
        defaultValue = '<p><br></p>',
        onChange = () => {},
        onInput = () => {},
        onKeyDown = () => {},
        onMount = () => {},
        options,
        style
      } = props;

      onMount(rte);

      const mockProps = {
        name,
        id,
        defaultValue,
        onChange(event) {
          onChange(event.target.value);
          globalThis.onChange(event.target.value);
        },
        onInput(event) {
          onInput(event, rte, event.target.value);
        },
        onKeyDown(event) {
          onKeyDown(event);
        },
        options,
        style
      };

      expect(customPlugins.length).toBe(1);

      const util = {
        addClass() {},
        removeClass() {}
      };
      const context = {};
      const core = {
        context
      };
      const element = {};

      const [sendButtonPlugin] = customPlugins;

      expect(core).toMatchObject({
        context: {}
      });

      sendButtonPlugin.add(core, element);

      expect(core).toMatchObject({
        context: {
          sendButtonPlugin: {
            targetButton: {}
          }
        }
      });

      sendButtonPlugin.active.call(
        {
          ...core,
          util
        },
        {
          nodeName: 'mark',
          style: {
            backgroundColor: ''
          }
        }
      );

      sendButtonPlugin.active.call(
        {
          ...core,
          util
        },
        {
          nodeName: 'mark',
          style: {
            backgroundColor: 'X'
          }
        }
      );

      sendButtonPlugin.active.call({
        ...core,
        util
      });

      return (
        <div>
          <textarea {...mockProps} />
          <button
            aria-label="Send message"
            onClick={() => props.customPlugins[0].action()}
          >
            THIS BUTTON IS PROVIDED BY THE MOCK
          </button>
        </div>
      );
    } else {
      return <div className={className} dangerouslySetInnerHTML={{ __html }} />;
    }
  };
});

import Layout from '@utils/Layout';
jest.mock('@utils/Layout', () => {
  return {
    ...jest.requireActual('@utils/Layout'),
    isForMobile: jest.fn(() => false)
  };
});

globalThis.onStop = null;
jest.mock('react-draggable', () => {
  return function(props) {
    const { children, onStop } = props;

    globalThis.onStop = onStop;
    return children;
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
  SAVE_RUN_EVENT_SUCCESS,
  SET_CHAT_ERROR,
  SET_CHAT_SUCCESS,
  SET_CHAT_USERS_SUCCESS,
  LINK_CHAT_TO_RUN_ERROR,
  LINK_CHAT_TO_RUN_SUCCESS
} from '../../actions/types';
import * as chatActions from '../../actions/chat';
import * as runActions from '../../actions/run';
import * as userActions from '../../actions/user';
jest.mock('../../actions/chat');
jest.mock('../../actions/run');
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

import Chat from '../../components/Chat/index.jsx';

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

  jest.spyOn(window, 'addEventListener');
  jest.spyOn(window, 'removeEventListener');

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
    lobby_id: 1,
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

  chatActions.getChat.mockImplementation(() => async dispatch => {
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
  chatActions.setChatUsersByChatId.mockImplementation(
    (id, users) => async dispatch => {
      dispatch({ type: SET_CHAT_USERS_SUCCESS, users });
      return users;
    }
  );
  runActions.saveRunEvent.mockImplementation(
    (run_id, name, data) => async dispatch => {
      const timestamp = Date.now();
      const url = location.href;
      const event = {
        timestamp,
        url,
        ...data
      };
      dispatch({ type: SAVE_RUN_EVENT_SUCCESS, name, event });
      return event;
    }
  );
  userActions.getUser.mockImplementation(() => async dispatch => {
    const user = superUser;
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });

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

test('Chat', () => {
  expect(Chat).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

/* INJECTION STARTS HERE */

test('No chat id, defaults to 1. This test should fail when the feature is completed', async done => {
  const Component = Chat;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    chat: {
      id: null
    }
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Layout on mobile', async done => {
  const Component = Chat;

  Layout.isForMobile.mockImplementation(() => {
    return true;
  });

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState,
    chat: {
      id: null
    }
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(screen.queryAllByTestId('chat-main').length).toBe(1)
  );
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Layout on desktop', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState,
    chat: {
      id: null
    }
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(screen.queryAllByTestId('chat-main').length).toBe(1)
  );
  expect(serialize()).toMatchSnapshot();

  done();
});

describe('componentDidMount', () => {
  test('Adds JOIN_OR_PART handler', async done => {
    const Component = Chat;

    const props = {
      ...commonProps
    };

    const state = {
      ...commonState
    };

    const ConnectedRoutedComponent = reduxer(Component, props, state);

    await render(<ConnectedRoutedComponent {...props} />);
    expect(serialize()).toMatchSnapshot();

    await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
    expect(globalThis.mockSocket.on.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "join-or-part",
        [Function],
      ]
    `);
    expect(serialize()).toMatchSnapshot();

    done();
  });

  test('Adds onbeforeunload handler', async done => {
    const Component = Chat;

    const props = {
      ...commonProps
    };

    const state = {
      ...commonState,
      chat: {
        id: null
      }
    };

    const ConnectedRoutedComponent = reduxer(Component, props, state);

    await render(<ConnectedRoutedComponent {...props} />);
    expect(serialize()).toMatchSnapshot();

    await waitFor(() =>
      expect(window.addEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function)
      )
    );
    expect(serialize()).toMatchSnapshot();

    done();
  });

  test('Emits USER_JOIN on socket', async done => {
    const Component = Chat;

    const props = {
      ...commonProps
    };

    const state = {
      ...commonState
    };

    const ConnectedRoutedComponent = reduxer(Component, props, state);

    const { asFragment, unmount } = render(
      <ConnectedRoutedComponent {...props} />
    );
    expect(serialize()).toMatchSnapshot();

    expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(1);
    expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "user-join",
          Object {
            "chat": Object {
              "id": 1,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
      ]
    `);
    expect(serialize()).toMatchSnapshot();

    done();
  });
});

describe('componentWillUnmount', () => {
  test('Removes onbeforeunload handler', async done => {
    const Component = Chat;

    const props = {
      ...commonProps
    };

    const state = {
      ...commonState
    };

    const ConnectedRoutedComponent = reduxer(Component, props, state);

    const { asFragment, unmount } = render(
      <ConnectedRoutedComponent {...props} />
    );
    expect(serialize()).toMatchSnapshot();

    await waitFor(() =>
      expect(window.addEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function)
      )
    );
    expect(serialize()).toMatchSnapshot();

    unmount();

    await waitFor(() =>
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function)
      )
    );
    expect(serialize()).toMatchSnapshot();

    done();
  });

  test('Calls onbeforeunload handler when beforeunload occurs', async done => {
    const Component = Chat;

    const props = {
      ...commonProps
    };

    const state = {
      ...commonState
    };

    window.addEventListener.mockRestore();
    window.removeEventListener.mockRestore();

    const ConnectedRoutedComponent = reduxer(Component, props, state);

    const { asFragment, unmount } = render(
      <ConnectedRoutedComponent {...props} />
    );
    expect(serialize()).toMatchSnapshot();

    await waitFor(() =>
      expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
        'join-or-part',
        expect.any(Function)
      )
    );

    expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(1);
    expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "user-join",
          Object {
            "chat": Object {
              "id": 1,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
      ]
    `);

    window.dispatchEvent(new Event('beforeunload'));

    await waitFor(() =>
      expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(2)
    );
    expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "user-join",
          Object {
            "chat": Object {
              "id": 1,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
        Array [
          "user-part",
          Object {
            "chat": Object {
              "id": 1,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
      ]
    `);

    expect(serialize()).toMatchSnapshot();

    done();
  });

  test('Calls onbeforeunload handler when unmount occurs', async done => {
    const Component = Chat;

    const props = {
      ...commonProps
    };

    const state = {
      ...commonState
    };

    window.addEventListener.mockRestore();
    window.removeEventListener.mockRestore();

    const ConnectedRoutedComponent = reduxer(Component, props, state);

    const { asFragment, unmount } = render(
      <ConnectedRoutedComponent {...props} />
    );
    expect(serialize()).toMatchSnapshot();

    await waitFor(() =>
      expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
        'join-or-part',
        expect.any(Function)
      )
    );

    expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(1);
    expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "user-join",
          Object {
            "chat": Object {
              "id": 1,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
      ]
    `);

    unmount();

    await waitFor(() =>
      expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(2)
    );
    expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "user-join",
          Object {
            "chat": Object {
              "id": 1,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
        Array [
          "user-part",
          Object {
            "chat": Object {
              "id": 1,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
      ]
    `);

    expect(serialize()).toMatchSnapshot();

    done();
  });
});

test('Calls onJoinOrPart when receives JOIN_OR_PART event', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment, unmount } = render(
    <ConnectedRoutedComponent {...props} />
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
      'join-or-part',
      expect.any(Function)
    )
  );

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.JOIN_OR_PART, { chat, user });

  expect(chatActions.setChatUsersByChatId).toHaveBeenCalledTimes(1);
  expect(chatActions.setChatUsersByChatId.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Array [
        Object {
          "email": "super@email.com",
          "id": 999,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
          ],
          "username": "super",
        },
        Object {
          "email": null,
          "id": 4,
          "is_anonymous": true,
          "is_muted": false,
          "is_present": true,
          "is_super": false,
          "personalname": null,
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "single_use_password": false,
          "updated_at": "2020-12-10T17:50:19.074Z",
          "username": "credible-lyrebird",
        },
        Object {
          "email": "super@email.com",
          "id": 999,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
          ],
          "username": "super",
        },
      ],
    ]
  `);

  done();
});

test('Calls onChange when RTE is cleared', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
      'join-or-part',
      expect.any(Function)
    )
  );

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.JOIN_OR_PART, { chat, user });
  globalThis.mockSocket.emit.mockReset();

  userEvent.clear(await screen.findByRole('textbox'));

  expect(globalThis.onChange).toHaveBeenCalled();
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Types, then attempts to send empty string', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
      'join-or-part',
      expect.any(Function)
    )
  );

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.JOIN_OR_PART, { user });
  globalThis.mockSocket.emit.mockReset();

  const textbox = await screen.findByRole('textbox');

  userEvent.clear(textbox);
  userEvent.type(textbox, '');
  userEvent.type(textbox, '{enter}');
  userEvent.click(await screen.findByLabelText('Send message'));

  expect(globalThis.onChange).toHaveBeenCalledTimes(0);
  expect(serialize()).toMatchSnapshot();

  expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(0);
  done();
});

test('Types, then attempts to send string containing only a space character', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
      'join-or-part',
      expect.any(Function)
    )
  );

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.JOIN_OR_PART, { user });
  globalThis.mockSocket.emit.mockReset();

  const textbox = await screen.findByRole('textbox');

  userEvent.clear(textbox);
  userEvent.type(textbox, '{space}');
  userEvent.type(textbox, '{enter}');
  userEvent.click(await screen.findByLabelText('Send message'));

  expect(globalThis.onChange).toHaveBeenCalledTimes(1);
  expect(globalThis.rte.setContents).toHaveBeenCalledTimes(0);
  expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(0);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Types, followed by {enter}', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
      'join-or-part',
      expect.any(Function)
    )
  );

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.JOIN_OR_PART, { user });
  globalThis.mockSocket.emit.mockReset();

  const textbox = await screen.findByRole('textbox');

  userEvent.clear(textbox);
  userEvent.type(textbox, 'typing enter');
  userEvent.type(textbox, '{enter}');
  userEvent.click(await screen.findByLabelText('Send message'));

  expect(globalThis.onChange).toHaveBeenCalled();
  expect(globalThis.rte.setContents).toHaveBeenCalledTimes(1);
  expect(globalThis.rte.setContents.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "<p><br></p>",
      ],
    ]
  `);
  expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(1);
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "new-message",
        Object {
          "chat": Object {
            "id": 1,
          },
          "content": "typing enter",
          "user": Object {
            "id": null,
          },
        },
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Types, followed by {shift}{enter}, does not submit', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
      'join-or-part',
      expect.any(Function)
    )
  );

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.JOIN_OR_PART, { user });
  globalThis.mockSocket.emit.mockReset();

  const textbox = await screen.findByRole('textbox');

  userEvent.clear(textbox);
  userEvent.type(textbox, 'typing shift+enter');
  userEvent.type(textbox, '{shift}{enter}');
  userEvent.click(await screen.findByLabelText('Send message'));

  expect(globalThis.onChange).toHaveBeenCalled();
  expect(globalThis.rte.setContents).toHaveBeenCalledTimes(1);
  expect(globalThis.rte.setContents.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "<p><br></p>",
      ],
    ]
  `);
  expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(1);
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "new-message",
        Object {
          "chat": Object {
            "id": 1,
          },
          "content": "typing shift+enter
    ",
          "user": Object {
            "id": null,
          },
        },
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Types, followed by {shift}{enter}, does not submit', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
      'join-or-part',
      expect.any(Function)
    )
  );

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.JOIN_OR_PART, { user });
  globalThis.mockSocket.emit.mockReset();

  const textbox = await screen.findByRole('textbox');

  userEvent.clear(textbox);
  userEvent.type(textbox, 'typing shift+enter');
  userEvent.type(textbox, '{enter}');
  userEvent.click(await screen.findByLabelText('Send message'));

  expect(globalThis.onChange).toHaveBeenCalled();
  expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(1);
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "new-message",
        Object {
          "chat": Object {
            "id": 1,
          },
          "content": "typing shift+enter",
          "user": Object {
            "id": null,
          },
        },
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Calls onInput when RTE receives new content', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
      'join-or-part',
      expect.any(Function)
    )
  );

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.JOIN_OR_PART, { user });
  globalThis.mockSocket.emit.mockReset();

  userEvent.type(await screen.findByRole('textbox'), 'typing in the chat');
  userEvent.click(await screen.findByLabelText('Send message'));

  expect(globalThis.onChange).toHaveBeenCalled();
  expect(globalThis.rte.setContents).toHaveBeenCalledTimes(1);
  expect(globalThis.rte.setContents.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "<p><br></p>",
      ],
    ]
  `);
  expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(1);
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "new-message",
        Object {
          "chat": Object {
            "id": 1,
          },
          "content": "<p><br></p>typing in the chat",
          "user": Object {
            "id": null,
          },
        },
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Calls onKeyDown, responds when key is {enter}', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
      'join-or-part',
      expect.any(Function)
    )
  );

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.JOIN_OR_PART, { user });
  globalThis.mockSocket.emit.mockReset();

  const textbox = await screen.findByRole('textbox');

  userEvent.clear(textbox);
  userEvent.type(textbox, 'typing in the chat');
  userEvent.type(textbox, '{enter}');

  expect(globalThis.onChange).toHaveBeenCalled();
  expect(globalThis.rte.setContents).toHaveBeenCalledTimes(1);
  expect(globalThis.rte.setContents.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "<p><br></p>",
      ],
    ]
  `);
  expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(1);
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "new-message",
        Object {
          "chat": Object {
            "id": 1,
          },
          "content": "typing in the chat",
          "user": Object {
            "id": null,
          },
        },
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Types, clicks Send Message', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
      'join-or-part',
      expect.any(Function)
    )
  );

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.JOIN_OR_PART, { user });
  globalThis.mockSocket.emit.mockReset();

  const textbox = await screen.findByRole('textbox');

  userEvent.clear(textbox);
  userEvent.type(textbox, 'typing in the chat');
  userEvent.type(textbox, '{enter}');
  userEvent.click(await screen.findByLabelText('Send message'));

  expect(globalThis.onChange).toHaveBeenCalled();
  expect(globalThis.rte.setContents).toHaveBeenCalledTimes(1);
  expect(globalThis.rte.setContents.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "<p><br></p>",
      ],
    ]
  `);
  expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(1);
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "new-message",
        Object {
          "chat": Object {
            "id": 1,
          },
          "content": "typing in the chat",
          "user": Object {
            "id": null,
          },
        },
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('onQuote', async done => {
  const Component = Chat;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
      'join-or-part',
      expect.any(Function)
    )
  );

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.JOIN_OR_PART, { user });
  globalThis.mockSocket.emit.mockReset();

  const textbox = await screen.findByRole('textbox');
  const quoteButtons = await screen.findAllByLabelText('Quote this message');

  userEvent.click(quoteButtons[0]);
  expect(globalThis.rte.setContents).toHaveBeenCalledTimes(1);
  expect(globalThis.rte.setContents.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "<p>Super User wrote:<blockquote><p>Hello</p></blockquote></p>",
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(quoteButtons[1]);
  expect(globalThis.rte.setContents).toHaveBeenCalledTimes(2);
  expect(globalThis.rte.setContents.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "<p>Super User wrote:<blockquote><p>Hello</p></blockquote></p>",
      ],
      Array [
        "<p>credible-lyrebird wrote:<blockquote><p>Hi!</p></blockquote></p>",
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Draggable: onStop', async done => {
  const Component = Chat;

  Storage.merge = jest.fn();
  Storage.merge.mockImplementation(() => {});

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(screen.queryAllByTestId('chat-main').length).toBe(1)
  );
  expect(serialize()).toMatchSnapshot();

  globalThis.onStop({}, { x: 10, y: 10 });

  await waitFor(() => expect(Storage.merge).toHaveBeenCalledTimes(1));

  expect(Storage.merge.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "chat/1",
      Object {
        "position": Object {
          "x": 10,
          "y": 10,
        },
      },
    ]
  `);

  done();
});
