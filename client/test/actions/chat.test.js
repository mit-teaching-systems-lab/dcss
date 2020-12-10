import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createMockStore,
  createPseudoRealStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/chat';
import * as types from '../../actions/types';
import Storage from '../../util/Storage';
jest.mock('../../util/Storage');

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));
let mockStore;
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
  Storage.has = jest.fn();
  Storage.delete = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
  Storage.has.mockRestore();
  Storage.delete.mockRestore();
});

beforeEach(() => {
  mockStore = createMockStore({});
  store = createPseudoRealStore({});
  fetch.mockImplementation(() => {});
  Storage.has.mockImplementation(() => true);
  Storage.delete.mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
  Storage.has.mockReset();
  Storage.delete.mockReset();
});

describe('GET_CHAT_SUCCESS', () => {
  describe('getChat', () => {
    let chat = { ...state.chats[0] };

    test('Receives a chat', async () => {
      fetchImplementation(fetch, 200, { chat });
      const returnValue = await store.dispatch(actions.getChat(1));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1",
        ]
      `);
      expect(returnValue).toEqual(chat);

      await mockStore.dispatch(actions.getChat(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('createChat', () => {
    let chat = { ...state.chats[0] };

    test('Receives a chat', async () => {
      fetchImplementation(fetch, 200, { chat });
      const returnValue = await store.dispatch(actions.createChat(chat));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats",
          Object {
            "body": "{\\"lobby_id\\":1}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(chat);

      await mockStore.dispatch(actions.createChat(chat));
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Empty params', async () => {
      fetchImplementation(fetch, 200, { chat });
      const returnValue = await store.dispatch(actions.createChat({}));
      expect(fetch.mock.calls.length).toBe(0);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setChat(1, {}));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_CHAT_ERROR', () => {
  let chat = { ...state.chats[0] };

  describe('getChat', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getChat(1));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.getChat(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('createChat', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.createChat(chat));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats",
          Object {
            "body": "{\\"lobby_id\\":1}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.createChat(chat));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('SET_CHAT_SUCCESS', () => {
  let chat = { ...state.chats[0] };

  describe('setChat', () => {
    test('Empty params', async () => {
      fetchImplementation(fetch, 200, { chat });
      const returnValue = await store.dispatch(actions.setChat(1, {}));
      expect(fetch.mock.calls.length).toBe(0);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setChat(1, {}));
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Receives a chat', async () => {
      fetchImplementation(fetch, 200, { chat });
      const returnValue = await store.dispatch(actions.setChat(1, chat));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1",
          Object {
            "body": "{\\"id\\":1,\\"lobby_id\\":1,\\"host_id\\":2,\\"created_at\\":\\"2020-12-08T21:51:33.659Z\\",\\"updated_at\\":null,\\"deleted_at\\":null,\\"ended_at\\":null}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(chat);

      await mockStore.dispatch(actions.setChat(1, chat));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('SET_CHAT_ERROR', () => {
  let chat = { ...state.chats[0] };

  describe('setChat', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.setChat(1, chat));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1",
          Object {
            "body": "{\\"id\\":1,\\"lobby_id\\":1,\\"host_id\\":2,\\"created_at\\":\\"2020-12-08T21:51:33.659Z\\",\\"updated_at\\":null,\\"deleted_at\\":null,\\"ended_at\\":null}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setChat(1, chat));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_CHATS_SUCCESS', () => {
  describe('getChats', () => {
    let chats = [...state.chats];

    test('Receives chats', async () => {
      fetchImplementation(fetch, 200, { chats });
      const returnValue = await store.dispatch(actions.getChats());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats",
        ]
      `);
      expect(returnValue).toEqual(chats);

      await mockStore.dispatch(actions.getChats());
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { chats: undefined });
      const returnValue = await store.dispatch(actions.getChats());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`Array []`);

      await mockStore.dispatch(actions.getChats());
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_CHATS_ERROR', () => {
  describe('getChats', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getChats());
      expect(fetch.mock.calls.length).toBe(1);
      expect(returnValue).toEqual(null);
      await mockStore.dispatch(actions.getChats());
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('LINK_CHAT_TO_RUN_SUCCESS', () => {
  describe('linkChatToRun', () => {
    let chats = [...state.chats];

    test('Receives chats for scenario', async () => {
      fetchImplementation(fetch, 200, { chats });
      const returnValue = await store.dispatch(actions.linkChatToRun(1, 2));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/link/1/run/2",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`undefined`);

      await mockStore.dispatch(actions.linkChatToRun(1, 2));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('LINK_CHAT_TO_RUN_ERROR', () => {
  describe('linkChatToRun', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.linkChatToRun(1, 2));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/link/1/run/2",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.linkChatToRun(1, 2));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_CHAT_MESSAGES_SUCCESS', () => {
  describe('getChatMessagesByChatId', () => {
    let messages = [];

    test('Receives messages', async () => {
      fetchImplementation(fetch, 200, { messages });
      const returnValue = await store.dispatch(
        actions.getChatMessagesByChatId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1/messages",
        ]
      `);
      expect(returnValue).toEqual(messages);

      await mockStore.dispatch(actions.getChatMessagesByChatId(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_CHAT_MESSAGES_ERROR', () => {
  describe('getChatMessagesByChatId', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.getChatMessagesByChatId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(returnValue).toEqual(null);
      await mockStore.dispatch(actions.getChatMessagesByChatId(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_CHAT_MESSAGES_COUNT_SUCCESS', () => {
  describe('getChatMessagesCountByChatId', () => {
    let count = 10;

    test('Receives count', async () => {
      fetchImplementation(fetch, 200, { count });
      const returnValue = await store.dispatch(
        actions.getChatMessagesCountByChatId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1/messages/count",
        ]
      `);
      expect(returnValue).toEqual(count);

      await mockStore.dispatch(actions.getChatMessagesCountByChatId(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_CHAT_MESSAGES_COUNT_ERROR', () => {
  describe('getChatMessagesCountByChatId', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.getChatMessagesCountByChatId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(returnValue).toEqual(null);
      await mockStore.dispatch(actions.getChatMessagesCountByChatId(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_CHAT_USERS_SUCCESS', () => {
  describe('getChatUsersByChatId', () => {
    let users = [
      {
        id: 999,
        username: 'super',
        personalname: 'Super User',
        email: 'super@email.com',
        is_anonymous: false,
        single_use_password: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true,
        updated_at: '2020-12-10T22:29:11.638Z',
        is_muted: false,
        is_present: true
      },
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

    test('Receives users', async () => {
      fetchImplementation(fetch, 200, { users });
      const returnValue = await store.dispatch(actions.getChatUsersByChatId(1));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1/users",
        ]
      `);
      expect(returnValue).toEqual(users);

      await mockStore.dispatch(actions.getChatUsersByChatId(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_CHAT_USERS_ERROR', () => {
  describe('getChatUsersByChatId', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getChatUsersByChatId(1));
      expect(fetch.mock.calls.length).toBe(1);
      expect(returnValue).toEqual(null);
      await mockStore.dispatch(actions.getChatUsersByChatId(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});
