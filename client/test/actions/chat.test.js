import { v4 as uuid } from 'uuid';
import {
  createMockStore,
  createMockConnectedStore,
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
  store = createMockConnectedStore({});
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "chat": Object {
              "created_at": "2020-12-08T21:51:33.659Z",
              "deleted_at": null,
              "ended_at": null,
              "host_id": 2,
              "id": 1,
              "scenario_id": 42,
              "updated_at": null,
            },
            "type": "GET_CHAT_SUCCESS",
          },
        ]
      `);
    });
  });

  describe('joinChat', () => {
    let chat = { ...state.chats[0] };

    test('Receives a chat', async () => {
      fetchImplementation(fetch, 200, { chat });
      const returnValue = await store.dispatch(actions.joinChat(1, {}));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1/join",
          Object {
            "body": "{\\"persona\\":{}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(chat);

      await mockStore.dispatch(actions.joinChat(1, {}));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "chat": Object {
              "created_at": "2020-12-08T21:51:33.659Z",
              "deleted_at": null,
              "ended_at": null,
              "host_id": 2,
              "id": 1,
              "scenario_id": 42,
              "updated_at": null,
            },
            "type": "GET_CHAT_SUCCESS",
          },
        ]
      `);
    });
  });

  describe('getChatByIdentifiers', () => {
    let chat = { ...state.chats[0] };

    test('Receives a chat, with scenario and cohort', async () => {
      fetchImplementation(fetch, 200, { chat });
      const scenario = { id: 1 };
      const cohort = { id: 2 };
      const returnValue = await store.dispatch(
        actions.getChatByIdentifiers(scenario, cohort)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/new-or-existing/scenario/1/cohort/2",
        ]
      `);
      expect(returnValue).toEqual(chat);

      await mockStore.dispatch(actions.getChatByIdentifiers(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "chat": Object {
              "created_at": "2020-12-08T21:51:33.659Z",
              "deleted_at": null,
              "ended_at": null,
              "host_id": 2,
              "id": 1,
              "scenario_id": 42,
              "updated_at": null,
            },
            "type": "GET_CHAT_SUCCESS",
          },
        ]
      `);
    });

    test('Receives a chat, with scenario', async () => {
      fetchImplementation(fetch, 200, { chat });
      const scenario = { id: 1 };
      const returnValue = await store.dispatch(
        actions.getChatByIdentifiers(scenario)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/new-or-existing/scenario/1",
        ]
      `);
      expect(returnValue).toEqual(chat);

      await mockStore.dispatch(actions.getChatByIdentifiers(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "chat": Object {
              "created_at": "2020-12-08T21:51:33.659Z",
              "deleted_at": null,
              "ended_at": null,
              "host_id": 2,
              "id": 1,
              "scenario_id": 42,
              "updated_at": null,
            },
            "type": "GET_CHAT_SUCCESS",
          },
        ]
      `);
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
            "body": "{\\"cohort_id\\":null,\\"scenario_id\\":1,\\"is_open\\":false}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(chat);

      await mockStore.dispatch(actions.createChat(chat));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "chat": Object {
              "created_at": "2020-12-08T21:51:33.659Z",
              "deleted_at": null,
              "ended_at": null,
              "host_id": 2,
              "id": 1,
              "scenario_id": 42,
              "updated_at": null,
            },
            "type": "GET_CHAT_SUCCESS",
          },
        ]
      `);
    });

    test('Empty params', async () => {
      fetchImplementation(fetch, 200, { chat });
      const returnValue = await store.dispatch(actions.createChat());
      expect(fetch.mock.calls.length).toBe(0);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setChat(1, {}));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`Array []`);
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_ERROR",
          },
        ]
      `);
    });
  });

  describe('joinChat', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.joinChat(1, {}));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1/join",
          Object {
            "body": "{\\"persona\\":{}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.joinChat(1, {}));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_ERROR",
          },
        ]
      `);
    });
  });

  describe('getChatByIdentifiers', () => {
    let chat = { ...state.chats[0] };
    const scenario = { id: 1 };
    const cohort = { id: 2 };

    test('Receives an error, with scenario and cohort', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.getChatByIdentifiers(scenario, cohort)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/new-or-existing/scenario/1/cohort/2",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.getChatByIdentifiers(scenario, cohort));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_ERROR",
          },
        ]
      `);
    });

    test('Receives an error, with scenario', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.getChatByIdentifiers(scenario)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/new-or-existing/scenario/1",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.getChatByIdentifiers(scenario));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_ERROR",
          },
        ]
      `);
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
            "body": "{\\"cohort_id\\":null,\\"scenario_id\\":1,\\"is_open\\":false}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.createChat(chat));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_ERROR",
          },
        ]
      `);
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`Array []`);
    });

    test('Receives a chat', async () => {
      fetchImplementation(fetch, 200, { chat });
      const returnValue = await store.dispatch(actions.setChat(1, chat));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1",
          Object {
            "body": "{\\"id\\":1,\\"scenario_id\\":42,\\"host_id\\":2,\\"created_at\\":\\"2020-12-08T21:51:33.659Z\\",\\"updated_at\\":null,\\"deleted_at\\":null,\\"ended_at\\":null}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(chat);

      await mockStore.dispatch(actions.setChat(1, chat));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "chat": Object {
              "created_at": "2020-12-08T21:51:33.659Z",
              "deleted_at": null,
              "ended_at": null,
              "host_id": 2,
              "id": 1,
              "scenario_id": 42,
              "updated_at": null,
            },
            "type": "SET_CHAT_SUCCESS",
          },
        ]
      `);
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
            "body": "{\\"id\\":1,\\"scenario_id\\":42,\\"host_id\\":2,\\"created_at\\":\\"2020-12-08T21:51:33.659Z\\",\\"updated_at\\":null,\\"deleted_at\\":null,\\"ended_at\\":null}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setChat(1, chat));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "SET_CHAT_ERROR",
          },
        ]
      `);
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "chats": Array [
              Object {
                "created_at": "2020-12-08T21:51:33.659Z",
                "deleted_at": null,
                "ended_at": null,
                "host_id": 2,
                "id": 1,
                "scenario_id": 42,
                "updated_at": null,
              },
            ],
            "type": "GET_CHATS_SUCCESS",
          },
        ]
      `);
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "chats": Array [],
            "type": "GET_CHATS_SUCCESS",
          },
        ]
      `);
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHATS_ERROR",
          },
        ]
      `);
    });
  });
  describe('getChatsByCohortId', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getChatsByCohortId(1));
      expect(fetch.mock.calls.length).toBe(1);
      expect(returnValue).toEqual(null);
      await mockStore.dispatch(actions.getChatsByCohortId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHATS_ERROR",
          },
        ]
      `);
    });
  });
});

describe('LINK_RUN_TO_CHAT_SUCCESS', () => {
  describe('linkRunToChat', () => {
    let chats = [...state.chats];

    test('Receives chats for scenario', async () => {
      fetchImplementation(fetch, 200, { chats });
      const returnValue = await store.dispatch(actions.linkRunToChat(1, 2));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/link/1/run/2",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`undefined`);

      await mockStore.dispatch(actions.linkRunToChat(1, 2));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "chat": undefined,
            "type": "LINK_RUN_TO_CHAT_SUCCESS",
          },
        ]
      `);
    });
  });
});

describe('LINK_RUN_TO_CHAT_ERROR', () => {
  describe('linkRunToChat', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.linkRunToChat(1, 2));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/link/1/run/2",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.linkRunToChat(1, 2));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "LINK_RUN_TO_CHAT_ERROR",
          },
        ]
      `);
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "messages": Array [],
            "type": "GET_CHAT_MESSAGES_SUCCESS",
          },
        ]
      `);
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_MESSAGES_ERROR",
          },
        ]
      `);
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "count": 10,
            "type": "GET_CHAT_MESSAGES_COUNT_SUCCESS",
          },
        ]
      `);
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_MESSAGES_COUNT_ERROR",
          },
        ]
      `);
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "GET_CHAT_USERS_SUCCESS",
            "users": Array [
              Object {
                "email": "super@email.com",
                "id": 999,
                "is_anonymous": false,
                "is_muted": false,
                "is_present": true,
                "is_super": true,
                "personalname": "Super User",
                "roles": Array [
                  "participant",
                  "super_admin",
                  "facilitator",
                  "researcher",
                ],
                "single_use_password": false,
                "updated_at": "2020-12-10T22:29:11.638Z",
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
          },
        ]
      `);
    });
  });
  describe('getLinkedChatUsersByChatId', () => {
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
      const returnValue = await store.dispatch(
        actions.getLinkedChatUsersByChatId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1/users/linked",
        ]
      `);
      expect(returnValue).toEqual(users);

      await mockStore.dispatch(actions.getLinkedChatUsersByChatId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "GET_CHAT_USERS_SUCCESS",
            "users": Array [
              Object {
                "email": "super@email.com",
                "id": 999,
                "is_anonymous": false,
                "is_muted": false,
                "is_present": true,
                "is_super": true,
                "personalname": "Super User",
                "roles": Array [
                  "participant",
                  "super_admin",
                  "facilitator",
                  "researcher",
                ],
                "single_use_password": false,
                "updated_at": "2020-12-10T22:29:11.638Z",
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
          },
        ]
      `);
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
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_USERS_ERROR",
          },
        ]
      `);
    });
  });
  describe('getLinkedChatUsersByChatId', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.getLinkedChatUsersByChatId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(returnValue).toEqual(null);
      await mockStore.dispatch(actions.getLinkedChatUsersByChatId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_USERS_ERROR",
          },
        ]
      `);
    });
  });
});

describe('SET_CHAT_USERS_SUCCESS', () => {
  describe('setChatUsersByChatId', () => {
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
      const returnValue = await store.dispatch(
        actions.setChatUsersByChatId(1, users)
      );
      expect(returnValue).toEqual(users);

      await mockStore.dispatch(actions.setChatUsersByChatId(1, users));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "SET_CHAT_USERS_SUCCESS",
            "users": Array [
              Object {
                "email": "super@email.com",
                "id": 999,
                "is_anonymous": false,
                "is_muted": false,
                "is_present": true,
                "is_super": true,
                "personalname": "Super User",
                "roles": Array [
                  "participant",
                  "super_admin",
                  "facilitator",
                  "researcher",
                ],
                "single_use_password": false,
                "updated_at": "2020-12-10T22:29:11.638Z",
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
          },
        ]
      `);
    });
  });

  describe('setChatUsersByChatId with a duplicate', () => {
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
      const returnValue = await store.dispatch(
        actions.setChatUsersByChatId(1, users)
      );
      expect(returnValue).toMatchInlineSnapshot(`
        Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "single_use_password": false,
            "updated_at": "2020-12-10T22:29:11.638Z",
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
        ]
      `);

      await mockStore.dispatch(actions.setChatUsersByChatId(1, users));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "SET_CHAT_USERS_SUCCESS",
            "users": Array [
              Object {
                "email": "super@email.com",
                "id": 999,
                "is_anonymous": false,
                "is_muted": false,
                "is_present": true,
                "is_super": true,
                "personalname": "Super User",
                "roles": Array [
                  "participant",
                  "super_admin",
                  "facilitator",
                  "researcher",
                ],
                "single_use_password": false,
                "updated_at": "2020-12-10T22:29:11.638Z",
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
          },
        ]
      `);
    });
  });
});

describe('SET_CHAT_MESSAGE_SUCCESS', () => {
  let params = {
    deleted_at: '2021-01-19T18:45:01.366Z'
  };
  const message = params;

  describe('setMessageById', () => {
    test('Empty params', async () => {
      fetchImplementation(fetch, 200, { message });
      const returnValue = await store.dispatch(actions.setMessageById(1, {}));
      expect(fetch.mock.calls.length).toBe(0);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setMessageById(1, {}));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`Array []`);
    });

    test('deleted_at', async () => {
      fetchImplementation(fetch, 200, { message });
      const returnValue = await store.dispatch(
        actions.setMessageById(1, params)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/messages/1",
          Object {
            "body": "{\\"deleted_at\\":\\"2021-01-19T18:45:01.366Z\\"}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(message);

      await mockStore.dispatch(actions.setMessageById(1, params));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "message": Object {
              "deleted_at": "2021-01-19T18:45:01.366Z",
            },
            "type": "SET_CHAT_MESSAGE_SUCCESS",
          },
        ]
      `);
    });
  });
});

describe('SET_CHAT_MESSAGE_ERROR', () => {
  let params = {
    deleted_at: '2021-01-19T18:45:01.366Z'
  };

  describe('setMessageById', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.setMessageById(1, params)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/messages/1",
          Object {
            "body": "{\\"deleted_at\\":\\"2021-01-19T18:45:01.366Z\\"}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setMessageById(1, params));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "SET_CHAT_MESSAGE_ERROR",
          },
        ]
      `);
    });
  });
});

describe('CREATE_CHAT_INVITE_SUCCESS', () => {
  describe('createChatInvite', () => {
    let invite = {};

    test('Receives invite', async () => {
      fetchImplementation(fetch, 200, { invite });
      const returnValue = await store.dispatch(actions.createChatInvite(1, {}));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1/invite",
          Object {
            "body": "{\\"invite\\":{}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(invite);

      await mockStore.dispatch(actions.createChatInvite(1, {}));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "invite": Object {},
            "type": "CREATE_CHAT_INVITE_SUCCESS",
          },
        ]
      `);
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { invite: undefined });
      const returnValue = await store.dispatch(actions.createChatInvite(1, {}));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1/invite",
          Object {
            "body": "{\\"invite\\":{}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`undefined`);

      await mockStore.dispatch(actions.createChatInvite(1, {}));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "invite": undefined,
            "type": "CREATE_CHAT_INVITE_SUCCESS",
          },
        ]
      `);
    });
  });
});

describe('CREATE_CHAT_INVITE_ERROR', () => {
  describe('createChatInvite', () => {
    let invite = {};

    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.createChatInvite(1, {}));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/1/invite",
          Object {
            "body": "{\\"invite\\":{}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.createChatInvite(1, {}));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "CREATE_CHAT_INVITE_ERROR",
          },
        ]
      `);
    });
  });
});

describe('GET_CHAT_TRANSCRIPTS_SUCCESS', () => {
  describe('getChatTranscriptsByChatId', () => {
    let messages = [];

    test('Receives messages', async () => {
      fetchImplementation(fetch, 200, { messages });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByChatId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/chat/1",
        ]
      `);
      expect(returnValue).toEqual(messages);

      await mockStore.dispatch(actions.getChatTranscriptsByChatId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "messages": Array [],
            "type": "GET_CHAT_TRANSCRIPTS_SUCCESS",
          },
        ]
      `);
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { messages: undefined });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByChatId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/chat/1",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`Array []`);

      await mockStore.dispatch(actions.getChatTranscriptsByChatId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "messages": Array [],
            "type": "GET_CHAT_TRANSCRIPTS_SUCCESS",
          },
        ]
      `);
    });
  });
  describe('getChatTranscriptsByCohortId', () => {
    let messages = [];

    test('Receives messages', async () => {
      fetchImplementation(fetch, 200, { messages });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByCohortId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/cohort/1",
        ]
      `);
      expect(returnValue).toEqual(messages);

      await mockStore.dispatch(actions.getChatTranscriptsByCohortId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "messages": Array [],
            "type": "GET_CHAT_TRANSCRIPTS_SUCCESS",
          },
        ]
      `);
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { messages: undefined });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByCohortId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/cohort/1",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`Array []`);

      await mockStore.dispatch(actions.getChatTranscriptsByCohortId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "messages": Array [],
            "type": "GET_CHAT_TRANSCRIPTS_SUCCESS",
          },
        ]
      `);
    });
  });
  describe('getChatTranscriptsByRunId', () => {
    let messages = [];

    test('Receives messages', async () => {
      fetchImplementation(fetch, 200, { messages });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByRunId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/run/1",
        ]
      `);
      expect(returnValue).toEqual(messages);

      await mockStore.dispatch(actions.getChatTranscriptsByRunId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "messages": Array [],
            "type": "GET_CHAT_TRANSCRIPTS_SUCCESS",
          },
        ]
      `);
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { messages: undefined });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByRunId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/run/1",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`Array []`);

      await mockStore.dispatch(actions.getChatTranscriptsByRunId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "messages": Array [],
            "type": "GET_CHAT_TRANSCRIPTS_SUCCESS",
          },
        ]
      `);
    });
  });
  describe('getChatTranscriptsByScenarioId', () => {
    let messages = [];

    test('Receives messages', async () => {
      fetchImplementation(fetch, 200, { messages });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByScenarioId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/scenario/1",
        ]
      `);
      expect(returnValue).toEqual(messages);

      await mockStore.dispatch(actions.getChatTranscriptsByScenarioId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "messages": Array [],
            "type": "GET_CHAT_TRANSCRIPTS_SUCCESS",
          },
        ]
      `);
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { messages: undefined });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByScenarioId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/scenario/1",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`Array []`);

      await mockStore.dispatch(actions.getChatTranscriptsByScenarioId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "messages": Array [],
            "type": "GET_CHAT_TRANSCRIPTS_SUCCESS",
          },
        ]
      `);
    });
  });
});

describe('GET_CHAT_TRANSCRIPTS_ERROR', () => {
  describe('getChatTranscriptsByChatId', () => {
    let messages = [];

    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByChatId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/chat/1",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.getChatTranscriptsByChatId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_TRANSCRIPTS_ERROR",
          },
        ]
      `);
    });
  });
  describe('getChatTranscriptsByCohortId', () => {
    let messages = [];

    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByCohortId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/cohort/1",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.getChatTranscriptsByCohortId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_TRANSCRIPTS_ERROR",
          },
        ]
      `);
    });
  });
  describe('getChatTranscriptsByRunId', () => {
    let messages = [];

    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByRunId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/run/1",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.getChatTranscriptsByRunId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_TRANSCRIPTS_ERROR",
          },
        ]
      `);
    });
  });
  describe('getChatTranscriptsByScenarioId', () => {
    let messages = [];

    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.getChatTranscriptsByScenarioId(1)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/chats/transcripts/scenario/1",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.getChatTranscriptsByScenarioId(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_CHAT_TRANSCRIPTS_ERROR",
          },
        ]
      `);
    });
  });
});
