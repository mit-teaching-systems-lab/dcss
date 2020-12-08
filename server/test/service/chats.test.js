import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/chats/db';
import * as ep from '../../service/chats/endpoints';

const error = new Error('something unexpected happened');

const user = {
  id: 999,
  email: 'super@email.com',
  roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
  is_super: true,
  username: 'superuser',
  is_anonymous: false,
  personalname: 'Super User'
};

const chat = {
  id: 1,
  lobby_id: 1,
  host_id: 999,
  created_at: '2020-12-08T21:51:33.659Z',
  updated_at: null,
  deleted_at: null,
  ended_at: null
};

const chats = [chat];

const chatsById = {
  [chat.id]: chat
};

const messages = [
  {
    id: 1,
    chat_id: 1,
    user_id: 2,
    content: '<p>Hello</p>',
    created_at: '2020-12-08T23:17:44.344Z',
    updated_at: null,
    deleted_at: null
  }
];

jest.mock('../../service/chats/db', () => {
  return {
    ...jest.requireActual('../../service/chats/db'),
    createChat: jest.fn(),
    linkChatToRun: jest.fn(),
    getChatById: jest.fn(),
    getChatMessagesByChatId: jest.fn(),
    getChatsByUserId: jest.fn(),
    getChats: jest.fn(),
    setChatById: jest.fn(),
    deleteChatById: jest.fn()
  };
});

import * as authmw from '../../service/auth/middleware';
jest.mock('../../service/auth/middleware', () => {
  const authmw = jest.requireActual('../../service/auth/middleware');
  return {
    ...authmw,
    requireUser: jest.fn()
  };
});

describe('/api/chats/*', () => {
  let persona = null;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    authmw.requireUser.mockImplementation((req, res, next) => {
      req.session.user = user;
      next();
    });

    db.createChat.mockImplementation(async props => props);
    db.setChatById.mockImplementation(async () => persona);
    db.getChatById.mockImplementation(async id => {
      return chatsById[id];
    });
    db.deleteChatById.mockImplementation(async () => chat);
    db.linkChatToRun.mockImplementation(async () => chat);
    db.getChats.mockImplementation(async () => chats);
    db.getChatsByUserId.mockImplementation(async () => chats);
    db.getChatMessagesByChatId.mockImplementation(async () => messages);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/chats/', () => {
    const path = '/api/chats/';

    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "chats": Array [
            Object {
              "created_at": "2020-12-08T21:51:33.659Z",
              "deleted_at": null,
              "ended_at": null,
              "host_id": 999,
              "id": 1,
              "lobby_id": 1,
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getChats.mock.calls.length).toBe(1);
      expect(db.getChats.mock.calls[0]).toMatchInlineSnapshot(`Array []`);
    });

    test('post success', async () => {
      const method = 'post';
      const body = {
        host_id: 999,
        lobby_id: 1
      };
      const response = await request({ path, method, body });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "chat": 999,
        }
      `);
      expect(db.createChat.mock.calls.length).toBe(1);
      expect(db.createChat.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
          1,
        ]
      `);
    });

    test('post failure, missing lobby_id', async () => {
      db.createChat.mockImplementation(async props => null);

      const method = 'post';
      const body = {};

      const response = await request({ path, method, body, status: 422 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Creating a chat requires a host and lobby.",
        }
      `);
      expect(db.createChat.mock.calls.length).toBe(0);
    });

    test('post failure, missing host_id', async () => {
      authmw.requireUser.mockImplementation((req, res, next) => {
        req.session.user = {};
        next();
      });

      const method = 'post';
      const body = {
        lobby_id: 1
      };
      const response = await request({ path, method, body, status: 422 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Creating a chat requires a host and lobby.",
        }
      `);
      expect(db.createChat.mock.calls.length).toBe(0);
    });

    test('post failure', async () => {
      db.createChat.mockImplementation(async props => null);

      const method = 'post';
      const body = {
        lobby_id: 1,
        host_id: 999
      };
      const response = await request({ path, method, body, status: 409 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Chat could not be created.",
        }
      `);
      expect(db.createChat.mock.calls.length).toBe(1);
      expect(db.createChat.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
          1,
        ]
      `);
    });
  });

  describe('/api/chats/my', () => {
    const path = '/api/chats/my';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "chats": Array [
            Object {
              "created_at": "2020-12-08T21:51:33.659Z",
              "deleted_at": null,
              "ended_at": null,
              "host_id": 999,
              "id": 1,
              "lobby_id": 1,
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getChatsByUserId.mock.calls.length).toBe(1);
      expect(db.getChatsByUserId.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
        ]
      `);
    });
  });

  describe('/api/chats/user/:id', () => {
    const path = '/api/chats/user/999';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "chats": Array [
            Object {
              "created_at": "2020-12-08T21:51:33.659Z",
              "deleted_at": null,
              "ended_at": null,
              "host_id": 999,
              "id": 1,
              "lobby_id": 1,
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getChatsByUserId.mock.calls.length).toBe(1);
      expect(db.getChatsByUserId.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
        ]
      `);
    });
  });

  describe('/api/chats/user/:id', () => {
    const path = '/api/chats/user/999';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "chats": Array [
            Object {
              "created_at": "2020-12-08T21:51:33.659Z",
              "deleted_at": null,
              "ended_at": null,
              "host_id": 999,
              "id": 1,
              "lobby_id": 1,
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getChatsByUserId.mock.calls.length).toBe(1);
      expect(db.getChatsByUserId.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
        ]
      `);
    });
  });

  describe('/api/chats/:id', () => {
    const path = '/api/chats/1';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "chat": Object {
            "created_at": "2020-12-08T21:51:33.659Z",
            "deleted_at": null,
            "ended_at": null,
            "host_id": 999,
            "id": 1,
            "lobby_id": 1,
            "updated_at": null,
          },
        }
      `);
      expect(db.getChatById.mock.calls.length).toBe(1);
      expect(db.getChatById.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
        ]
      `);
    });
  });

  describe('/api/chats/:id', () => {
    const path = '/api/chats/2';
    const method = 'put';

    test('put success (soft delete)', async () => {
      const body = {
        deleted_at: '2020-11-16T14:52:28.429Z'
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "chat": null,
        }
      `);
      expect(db.setChatById.mock.calls.length).toBe(1);
      expect(db.setChatById.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "deleted_at": "2020-11-16T14:52:28.429Z",
          },
        ]
      `);
    });

    test('put success (partial: no deleted_at)', async () => {
      const body = {
        ...chat
      };

      delete body.deleted_at;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`Object {}`);
      expect(db.setChatById.mock.calls.length).toBe(0);
    });

    test('put failure', async () => {
      db.linkChatToRun.mockImplementation(async () => null);

      const response = await request({ path, method, status: 500 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "No request body!",
        }
      `);
      expect(db.setChatById.mock.calls.length).toBe(0);
    });
  });

  describe('/api/chats/link/:id/run/:run_id', () => {
    const path = '/api/chats/link/1/run/42';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "chat": Object {
            "created_at": "2020-12-08T21:51:33.659Z",
            "deleted_at": null,
            "ended_at": null,
            "host_id": 999,
            "id": 1,
            "lobby_id": 1,
            "updated_at": null,
          },
        }
      `);
      expect(db.linkChatToRun.mock.calls.length).toBe(1);
      expect(db.linkChatToRun.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
          42,
        ]
      `);
    });

    test('get failure: linkChatToRun', async () => {
      db.linkChatToRun.mockImplementation(async () => {
        throw error;
      });

      const response = await request({ path, status: 409 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Chat could not be linked.",
        }
      `);
      expect(db.linkChatToRun.mock.calls.length).toBe(1);
      expect(db.getChatById.mock.calls.length).toBe(0);
    });

    test('get failure: getChatById', async () => {
      db.getChatById.mockImplementation(async () => {
        throw error;
      });

      const response = await request({ path, status: 409 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Chat could not be linked.",
        }
      `);
      expect(db.linkChatToRun.mock.calls.length).toBe(1);
      expect(db.getChatById.mock.calls.length).toBe(1);
    });
  });

  describe('/api/chats/:id/messages', () => {
    const path = '/api/chats/1/messages';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "messages": Array [
            Object {
              "chat_id": 1,
              "content": "<p>Hello</p>",
              "created_at": "2020-12-08T23:17:44.344Z",
              "deleted_at": null,
              "id": 1,
              "updated_at": null,
              "user_id": 2,
            },
          ],
        }
      `);
      expect(db.getChatMessagesByChatId.mock.calls.length).toBe(1);
      expect(db.getChatMessagesByChatId.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
        ]
      `);
    });
  });
});
