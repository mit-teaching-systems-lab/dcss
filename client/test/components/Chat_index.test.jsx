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
  function RichTextEditor(props) {
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
          <div className="se-wrapper">
            <div>a</div>
            <div>b</div>
            <div>c</div>
          </div>
        </div>
      );
    } else {
      return <div className={className} dangerouslySetInnerHTML={{ __html }} />;
    }
  }

  function RichTextRenderer(props) {
    const modeProps = {
      ...props,
      mode: 'display'
    };
    return <RichTextEditor {...modeProps} />;
  }

  return {
    __esModule: true,
    default: RichTextEditor,
    RichTextRenderer
  };
});

import Layout from '@utils/Layout';
jest.mock('@utils/Layout', () => {
  return {
    ...jest.requireActual('@utils/Layout'),
    isForMobile: jest.fn(() => false)
  };
});

globalThis.rndProps = {};
jest.mock('react-rnd', () => {
  function Rnd(props) {
    globalThis.rndProps = {
      ...props
    };

    return <div>{props.children}</div>;
  }

  return {
    __esModule: true,
    Rnd
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
  LINK_RUN_TO_CHAT_ERROR,
  LINK_RUN_TO_CHAT_SUCCESS
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

  globalThis.rndProps = null;

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
    scenario_id: 42,
    cohort_id: null,
    host_id: 999,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    users: chatUsers
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

test('Chat', () => {
  expect(Chat).toBeDefined();
});

/** @GENERATED: BEGIN **/
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
/** @GENERATED: END **/

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
  test('Adds CHAT_ENDED handler', async done => {
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
        "chat-ended",
        [Function],
      ]
    `);
    expect(serialize()).toMatchSnapshot();

    done();
  });
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
        "chat-ended",
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

  test('Emits CREATE_USER_CHANNEL on socket', async done => {
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

    await waitFor(() =>
      expect(screen.queryAllByTestId('chat-main').length).toBe(1)
    );

    expect(serialize()).toMatchSnapshot();

    expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(2);
    expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "create-chat-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
        Array [
          "create-user-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
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

  test('Emits CREATE_CHAT_CHANNEL on socket', async done => {
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

    await waitFor(() =>
      expect(screen.queryAllByTestId('chat-main').length).toBe(1)
    );

    expect(serialize()).toMatchSnapshot();

    expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(2);
    expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "create-chat-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
        Array [
          "create-user-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
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

    await waitFor(() =>
      expect(screen.queryAllByTestId('chat-main').length).toBe(1)
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

    await waitFor(() =>
      expect(screen.queryAllByTestId('chat-main').length).toBe(1)
    );

    expect(serialize()).toMatchSnapshot();

    await waitFor(() =>
      expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
        'join-or-part',
        expect.any(Function)
      )
    );

    expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(2);
    expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "create-chat-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
        Array [
          "create-user-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
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
          "create-chat-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
        Array [
          "create-user-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
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

    await waitFor(() =>
      expect(screen.queryAllByTestId('chat-main').length).toBe(1)
    );

    expect(serialize()).toMatchSnapshot();

    await waitFor(() =>
      expect(globalThis.mockSocket.on).toHaveBeenCalledWith(
        'join-or-part',
        expect.any(Function)
      )
    );

    expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(2);
    expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "create-chat-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
        Array [
          "create-user-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
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
          "create-chat-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
            },
            "user": Object {
              "id": null,
            },
          },
        ],
        Array [
          "create-user-channel",
          Object {
            "agent": Object {},
            "chat": Object {
              "host_id": 2,
              "id": 1,
            },
            "prompt": Object {
              "id": null,
            },
            "response": Object {
              "id": undefined,
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

test('Calls onChatEnded when receives CHAT_ENDED event', async done => {
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

  globalThis.mockSocket.emit(SOCKET_EVENT_TYPES.CHAT_ENDED, { chat, user });

  await waitFor(async () =>
    expect(await screen.findByLabelText('Chat is closed')).toBeInTheDocument()
  );

  expect(serialize()).toMatchSnapshot();

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
  await waitForPopper();

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
  await waitForPopper();
  userEvent.type(textbox, '');
  await waitForPopper();
  userEvent.type(textbox, '{enter}');
  await waitForPopper();
  userEvent.click(await screen.findByLabelText('Send message'));
  await waitForPopper();

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
  await waitForPopper();
  userEvent.type(textbox, '{space}');
  await waitForPopper();
  userEvent.type(textbox, '{enter}');
  await waitForPopper();
  userEvent.click(await screen.findByLabelText('Send message'));
  await waitForPopper();

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
  await waitForPopper();
  userEvent.type(textbox, 'typing enter');
  await waitForPopper();
  userEvent.type(textbox, '{enter}');
  await waitForPopper();
  userEvent.click(await screen.findByLabelText('Send message'));
  await waitForPopper();

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
        "chat-message-created",
        Object {
          "agent": Object {},
          "chat": Object {
            "host_id": 2,
            "id": 1,
          },
          "content": "typing enter",
          "prompt": Object {
            "id": null,
          },
          "response": Object {
            "id": undefined,
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
  await waitForPopper();
  userEvent.type(textbox, 'typing shift+enter');
  await waitForPopper();
  userEvent.type(textbox, '{shift}{enter}');
  await waitForPopper();
  userEvent.click(await screen.findByLabelText('Send message'));
  await waitForPopper();

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
        "chat-message-created",
        Object {
          "agent": Object {},
          "chat": Object {
            "host_id": 2,
            "id": 1,
          },
          "content": "typing shift+enter
    ",
          "prompt": Object {
            "id": null,
          },
          "response": Object {
            "id": undefined,
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

test('Empty, many {shift}{enter}, attempts to send, does not submit', async done => {
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
  await waitForPopper();
  userEvent.type(
    textbox,
    '{shift}{enter}{shift}{enter}{shift}{enter}{shift}{enter}{shift}{enter}'
  );
  await waitForPopper();
  userEvent.click(await screen.findByLabelText('Send message'));
  await waitForPopper();

  expect(globalThis.onChange).toHaveBeenCalled();
  expect(globalThis.rte.setContents).toHaveBeenCalledTimes(0);
  expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(0);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Types, followed by {shift}{enter}, attempts to send, does submit', async done => {
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
  await waitForPopper();
  userEvent.type(textbox, 'typing enter');
  await waitForPopper();
  userEvent.type(textbox, '{enter}');
  await waitForPopper();
  userEvent.click(await screen.findByLabelText('Send message'));
  await waitForPopper();

  expect(globalThis.onChange).toHaveBeenCalled();
  expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(1);
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-message-created",
        Object {
          "agent": Object {},
          "chat": Object {
            "host_id": 2,
            "id": 1,
          },
          "content": "typing enter",
          "prompt": Object {
            "id": null,
          },
          "response": Object {
            "id": undefined,
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
  await waitForPopper();
  userEvent.click(await screen.findByLabelText('Send message'));
  await waitForPopper();

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
        "chat-message-created",
        Object {
          "agent": Object {},
          "chat": Object {
            "host_id": 2,
            "id": 1,
          },
          "content": "<p><br></p>typing in the chat",
          "prompt": Object {
            "id": null,
          },
          "response": Object {
            "id": undefined,
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
  await waitForPopper();
  userEvent.type(textbox, 'typing in the chat');
  await waitForPopper();
  userEvent.type(textbox, '{enter}');
  await waitForPopper();

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
        "chat-message-created",
        Object {
          "agent": Object {},
          "chat": Object {
            "host_id": 2,
            "id": 1,
          },
          "content": "typing in the chat",
          "prompt": Object {
            "id": null,
          },
          "response": Object {
            "id": undefined,
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
  await waitForPopper();
  userEvent.type(textbox, 'typing in the chat');
  await waitForPopper();
  userEvent.type(textbox, '{enter}');
  await waitForPopper();
  userEvent.click(await screen.findByLabelText('Send message'));
  await waitForPopper();

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
        "chat-message-created",
        Object {
          "agent": Object {},
          "chat": Object {
            "host_id": 2,
            "id": 1,
          },
          "content": "typing in the chat",
          "prompt": Object {
            "id": null,
          },
          "response": Object {
            "id": undefined,
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
  await waitForPopper();
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
  await waitForPopper();
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

test('Rnd: onDragStop/onResizeStop', async done => {
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

  expect(globalThis.rndProps).toMatchInlineSnapshot(`
    Object {
      "bounds": "window",
      "children": <Ref
        innerRef={[Function]}
      >
        <div
          className="ui modal transition visible active c__container-modal resizable"
          role="dialog"
        >
          <ChatMinMax
            className=""
            isMinimized={false}
            onChange={[Function]}
          />
          <div
            className="ui header c__drag-handle"
            tabIndex="0"
          >
            <React.Fragment>
              <Icon
                as="i"
                name="discussions"
              />
              <div
                className="content"
              >
                Discussion
              </div>
            </React.Fragment>
          </div>
          <Ref
            innerRef={[Function]}
          >
            <div
              className="content inner visible"
              tabIndex="0"
            >
              <div
                className="cm__container-outer"
                style={
                  Object {
                    "width": "calc(\${dimensions.width}px)",
                  }
                }
              >
                <Memo(Connect(ChatMessages))
                  chat={
                    Object {
                      "cohort_id": null,
                      "created_at": "2020-12-08T21:51:33.659Z",
                      "deleted_at": null,
                      "ended_at": null,
                      "host_id": 2,
                      "id": 1,
                      "is_open": false,
                      "scenario_id": 42,
                      "updated_at": null,
                      "users": Array [
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
                      ],
                      "usersById": Object {
                        "4": Object {
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
                        "999": Object {
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
                      },
                    }
                  }
                  isMinimized={false}
                  onMessageReceived={[Function]}
                  onQuote={[Function]}
                  prompt={
                    Object {
                      "id": null,
                    }
                  }
                  slice={-20}
                  socket={
                    Object {
                      "_events": Object {
                        "chat-ended": Array [
                          [Function],
                          [Function],
                        ],
                        "chat-message-created": Array [
                          [Function],
                          [Function],
                          [Function],
                        ],
                        "chat-message-updated": [Function],
                        "join-or-part": Array [
                          [Function],
                          [Function],
                        ],
                      },
                      "_eventsCount": 4,
                      "disconnect": [MockFunction],
                      "emit": [MockFunction] {
                        "calls": Array [
                          Array [
                            "create-chat-channel",
                            Object {
                              "agent": Object {},
                              "chat": Object {
                                "host_id": 2,
                                "id": 1,
                              },
                              "prompt": Object {
                                "id": null,
                              },
                              "response": Object {
                                "id": undefined,
                              },
                              "user": Object {
                                "id": null,
                              },
                            },
                          ],
                          Array [
                            "create-user-channel",
                            Object {
                              "agent": Object {},
                              "chat": Object {
                                "host_id": 2,
                                "id": 1,
                              },
                              "prompt": Object {
                                "id": null,
                              },
                              "response": Object {
                                "id": undefined,
                              },
                              "user": Object {
                                "id": null,
                              },
                            },
                          ],
                        ],
                        "results": Array [
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                        ],
                      },
                      "off": [MockFunction],
                      "on": [MockFunction] {
                        "calls": Array [
                          Array [
                            "chat-ended",
                            [Function],
                          ],
                          Array [
                            "chat-message-created",
                            [Function],
                          ],
                          Array [
                            "join-or-part",
                            [Function],
                          ],
                          Array [
                            "chat-message-created",
                            [Function],
                          ],
                          Array [
                            "chat-message-updated",
                            [Function],
                          ],
                        ],
                        "results": Array [
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                        ],
                      },
                    }
                  }
                />
              </div>
              <div
                className="cc__container-outer"
                style={
                  Object {
                    "width": "calc(\${dimensions.width}px)",
                  }
                }
              >
                <ChatComposer
                  defaultValue="<p>credible-lyrebird wrote:<blockquote><p>Hi!</p></blockquote></p>"
                  id="x26"
                  name="content"
                  onChange={[Function]}
                  onInput={[Function]}
                  onKeyDown={[Function]}
                  onMount={[Function]}
                  options={
                    Object {
                      "height": "109.82500000000002px",
                      "maxHeight": "109.82500000000002px",
                      "minHeight": "109.82500000000002px",
                      "width": "456px",
                    }
                  }
                  sendNewMessage={[Function]}
                />
              </div>
            </div>
          </Ref>
          <div
            data-testid="chat-main"
          />
        </div>
      </Ref>,
      "disableDragging": false,
      "dragHandleClassName": "c__drag-handle",
      "minHeight": 590,
      "minWidth": 456,
      "onDrag": [Function],
      "onDragStart": [Function],
      "onDragStop": [Function],
      "onResize": [Function],
      "onResizeStart": [Function],
      "onResizeStop": [Function],
      "position": Object {
        "x": 0,
        "y": 0,
      },
      "resizeHandleWrapperClass": "c__size-handle",
      "size": Object {
        "height": 590,
        "width": 456,
      },
      "style": Object {
        "alignItems": "center",
        "background": "#f0f0f0",
        "display": "flex",
        "justifyContent": "center",
      },
    }
  `);

  const event = {};
  const direction = 'top';
  const resizer = document.createElement('div');
  const delta = { width: 400, height: 400 };
  const position = { x: 393, y: 174 };
  // e, { x, y }
  globalThis.rndProps.onDragStop(event, { ...delta, ...position });

  // e, direction, resizer, delta, position
  globalThis.rndProps.onResizeStop(event, direction, resizer, delta, position);

  await waitFor(() => expect(Storage.merge).toHaveBeenCalledTimes(1));

  expect(Storage.merge.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "chat/*",
      Object {
        "dimensions": Object {
          "height": 590,
          "width": 456,
        },
        "position": Object {
          "x": 393,
          "y": 174,
        },
      },
    ]
  `);

  done();
});

test('Rnd: onDrag/onResize', async done => {
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

  expect(globalThis.rndProps).toMatchInlineSnapshot(`
    Object {
      "bounds": "window",
      "children": <Ref
        innerRef={[Function]}
      >
        <div
          className="ui modal transition visible active c__container-modal resizable"
          role="dialog"
        >
          <ChatMinMax
            className=""
            isMinimized={false}
            onChange={[Function]}
          />
          <div
            className="ui header c__drag-handle"
            tabIndex="0"
          >
            <React.Fragment>
              <Icon
                as="i"
                name="discussions"
              />
              <div
                className="content"
              >
                Discussion
              </div>
            </React.Fragment>
          </div>
          <Ref
            innerRef={[Function]}
          >
            <div
              className="content inner visible"
              tabIndex="0"
            >
              <div
                className="cm__container-outer"
                style={
                  Object {
                    "width": "calc(\${dimensions.width}px)",
                  }
                }
              >
                <Memo(Connect(ChatMessages))
                  chat={
                    Object {
                      "cohort_id": null,
                      "created_at": "2020-12-08T21:51:33.659Z",
                      "deleted_at": null,
                      "ended_at": null,
                      "host_id": 2,
                      "id": 1,
                      "is_open": false,
                      "scenario_id": 42,
                      "updated_at": null,
                      "users": Array [
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
                      ],
                      "usersById": Object {
                        "4": Object {
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
                        "999": Object {
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
                      },
                    }
                  }
                  isMinimized={false}
                  onMessageReceived={[Function]}
                  onQuote={[Function]}
                  prompt={
                    Object {
                      "id": null,
                    }
                  }
                  slice={-20}
                  socket={
                    Object {
                      "_events": Object {
                        "chat-ended": Array [
                          [Function],
                          [Function],
                        ],
                        "chat-message-created": Array [
                          [Function],
                          [Function],
                          [Function],
                        ],
                        "chat-message-updated": [Function],
                        "join-or-part": Array [
                          [Function],
                          [Function],
                        ],
                      },
                      "_eventsCount": 4,
                      "disconnect": [MockFunction],
                      "emit": [MockFunction] {
                        "calls": Array [
                          Array [
                            "create-chat-channel",
                            Object {
                              "agent": Object {},
                              "chat": Object {
                                "host_id": 2,
                                "id": 1,
                              },
                              "prompt": Object {
                                "id": null,
                              },
                              "response": Object {
                                "id": undefined,
                              },
                              "user": Object {
                                "id": null,
                              },
                            },
                          ],
                          Array [
                            "create-user-channel",
                            Object {
                              "agent": Object {},
                              "chat": Object {
                                "host_id": 2,
                                "id": 1,
                              },
                              "prompt": Object {
                                "id": null,
                              },
                              "response": Object {
                                "id": undefined,
                              },
                              "user": Object {
                                "id": null,
                              },
                            },
                          ],
                        ],
                        "results": Array [
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                        ],
                      },
                      "off": [MockFunction],
                      "on": [MockFunction] {
                        "calls": Array [
                          Array [
                            "chat-ended",
                            [Function],
                          ],
                          Array [
                            "chat-message-created",
                            [Function],
                          ],
                          Array [
                            "join-or-part",
                            [Function],
                          ],
                          Array [
                            "chat-message-created",
                            [Function],
                          ],
                          Array [
                            "chat-message-updated",
                            [Function],
                          ],
                        ],
                        "results": Array [
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                          Object {
                            "type": "return",
                            "value": undefined,
                          },
                        ],
                      },
                    }
                  }
                />
              </div>
              <div
                className="cc__container-outer"
                style={
                  Object {
                    "width": "calc(\${dimensions.width}px)",
                  }
                }
              >
                <ChatComposer
                  defaultValue="<p>credible-lyrebird wrote:<blockquote><p>Hi!</p></blockquote></p>"
                  id="x27"
                  name="content"
                  onChange={[Function]}
                  onInput={[Function]}
                  onKeyDown={[Function]}
                  onMount={[Function]}
                  options={
                    Object {
                      "height": "109.82500000000002px",
                      "maxHeight": "109.82500000000002px",
                      "minHeight": "109.82500000000002px",
                      "width": "456px",
                    }
                  }
                  sendNewMessage={[Function]}
                />
              </div>
            </div>
          </Ref>
          <div
            data-testid="chat-main"
          />
        </div>
      </Ref>,
      "disableDragging": false,
      "dragHandleClassName": "c__drag-handle",
      "minHeight": 590,
      "minWidth": 456,
      "onDrag": [Function],
      "onDragStart": [Function],
      "onDragStop": [Function],
      "onResize": [Function],
      "onResizeStart": [Function],
      "onResizeStop": [Function],
      "position": Object {
        "x": 0,
        "y": 0,
      },
      "resizeHandleWrapperClass": "c__size-handle",
      "size": Object {
        "height": 590,
        "width": 456,
      },
      "style": Object {
        "alignItems": "center",
        "background": "#f0f0f0",
        "display": "flex",
        "justifyContent": "center",
      },
    }
  `);

  const event = {};
  const direction = 'top';
  const resizer = document.createElement('div');
  const delta = { width: 400, height: 400 };
  const position = { x: 393, y: 174 };
  // e, { x, y }
  globalThis.rndProps.onDrag(event, { ...delta, ...position });

  // e, direction, resizer, delta, position
  globalThis.rndProps.onResize(event, direction, resizer, delta, position);

  await waitFor(() => expect(Storage.merge).not.toHaveBeenCalled());

  expect(Storage.merge.mock.calls[0]).toMatchInlineSnapshot(`undefined`);

  done();
});

test('Click to Minimize and Maximize', async done => {
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

  const button = await screen.findByLabelText(/minimize/i);

  userEvent.click(button);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(button);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Receives new message, not minimized', async done => {
  const Component = Chat;

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
      content: `<p>Hello</p>`,
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

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(11)
  );

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-ended",
        [Function],
      ],
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "join-or-part",
        [Function],
      ],
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

test('Receives new message, minimized, not mobile', async done => {
  const Component = Chat;

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
      content: `<p>Hello</p>`,
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

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(11)
  );

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-ended",
        [Function],
      ],
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "join-or-part",
        [Function],
      ],
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
  expect(serialize()).toMatchSnapshot();

  userEvent.click(
    await screen.findByRole('button', {
      name: /Click to minimize the chat window/i
    })
  );
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: `<p>A new message</p>`,
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(0)
  );
  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Receives new message, minimized, mobile', async done => {
  const Component = Chat;

  Layout.isForMobile.mockImplementation(() => {
    return true;
  });

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
      content: `<p>Hello</p>`,
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

  await waitFor(() =>
    expect(screen.queryAllByTestId('comment').length).toBe(10)
  );

  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "chat-ended",
        [Function],
      ],
      Array [
        "chat-message-created",
        [Function],
      ],
      Array [
        "join-or-part",
        [Function],
      ],
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
  expect(serialize()).toMatchSnapshot();

  userEvent.click(
    await screen.findByRole('button', {
      name: /Click to minimize the chat window/i
    })
  );
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('chat-message-created', {
    chat_id: 1,
    content: `<p>A new message</p>`,
    created_at: '2020-12-15T09:40:10.359Z',
    deleted_at: null,
    id: messages.length,
    is_quotable: true,
    updated_at: null,
    user_id: 4
  });

  expect(screen.queryByLabelText('See new message')).toBe(null);
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.getChatMessagesByChatId).toHaveBeenCalled();
  expect(chatActions.getChatMessagesCountByChatId).toHaveBeenCalled();

  done();
});

test('Chat id provided via props, but not yet loaded', async done => {
  const Component = Chat;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    chat: {
      id: 1,
      created_at: null
    }
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(chatActions.getChat).toHaveBeenCalled());
  done();
});

test('Chat has ended', async done => {
  const Component = Chat;

  chat.ended_at = 'anything but null';

  const props = {
    ...commonProps,
    chat
  };

  const state = {
    ...commonState,
    chat
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(async () =>
    expect(await screen.getByLabelText('Chat is closed')).toBeInTheDocument()
  );

  window.alert = jest.fn();

  userEvent.click(await screen.getByLabelText('Chat is closed'));
  await waitForPopper();

  expect(window.alert).toHaveBeenCalled();
  done();
});
