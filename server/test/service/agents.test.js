import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/agents/db';
import * as ep from '../../service/agents/endpoints';

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

const agent = {
  id: 1,
  created_at: '2021-02-25T17:31:33.826Z',
  updated_at: '2021-02-25T20:09:04.999Z',
  deleted_at: null,
  is_active: true,
  name: 'Emoji Analysis',
  description: 'Detects the presense of an emoji character in your text',
  endpoint: 'ws://emoji-analysis-production.herokuapp.com',
  configuration: {
    bar: '2',
    baz: 'c',
    foo: 'false'
  },
  socket: {
    path: '/foo/bar/baz'
  },
  interaction: {
    id: 18,
    name: 'ChatPrompt',
    created_at: '2021-02-25T15:09:05.001302-05:00',
    deleted_at: null,
    updated_at: null
  },
  owner: user,
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
  }
};

const agents = [agent];
const agentsById = agents.reduce(
  (accum, agent) => ({
    ...accum,
    [agent.id]: agent
  }),
  {}
);

const interactions = [
  {
    id: 1,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: null,
    deleted_at: null,
    name: 'ChatPrompt'
  },
  {
    id: 2,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: null,
    deleted_at: null,
    name: 'AudioPrompt'
  },
  {
    id: 3,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: null,
    deleted_at: null,
    name: 'TextPrompt'
  }
];

jest.mock('../../service/agents/db', () => {
  return {
    ...jest.requireActual('../../service/agents/db'),
    createAgent: jest.fn(),
    getAgent: jest.fn(),
    getAgents: jest.fn(),
    setAgent: jest.fn(),
    setAgentInteraction: jest.fn(),
    setAgentConfiguration: jest.fn(),
    setAgentSocketConfiguration: jest.fn(),
    getInteractions: jest.fn()
  };
});

import * as authmw from '../../service/session/middleware';
jest.mock('../../service/session/middleware', () => {
  const authmw = jest.requireActual('../../service/session/middleware');
  return {
    ...authmw,
    requireUser: jest.fn()
  };
});

import * as rolesmw from '../../service/roles/middleware';
jest.mock('../../service/roles/middleware', () => {
  const rolesmw = jest.requireActual('../../service/roles/middleware');
  return {
    ...rolesmw,
    requireUserRole: jest.fn(() => [])
  };
});

describe('/api/agents/*', () => {
  let persona = null;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    authmw.requireUser.mockImplementation((req, res, next) => {
      req.session.user = user;
      next();
    });

    db.createAgent.mockImplementation(async props => props);
    db.getAgents.mockImplementation(async () => [agent]);
    db.getAgent.mockImplementation(async id => {
      return agentsById[id];
    });
    db.setAgent.mockImplementation(async props => props);
    db.setAgentInteraction.mockImplementation(async (id, props) => props);
    db.setAgentConfiguration.mockImplementation(async (id, props) => props);
    db.setAgentSocketConfiguration.mockImplementation(
      async (id, props) => props
    );
    db.getInteractions.mockImplementation(async () => interactions);

    rolesmw.requireUserRole.mockImplementation(() => [
      (req, res, next) => next()
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/agents/', () => {
    const path = '/api/agents/';

    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "agents": Array [
            Object {
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
                "id": 18,
                "name": "ChatPrompt",
                "updated_at": null,
              },
              "is_active": true,
              "name": "Emoji Analysis",
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
                "path": "/foo/bar/baz",
              },
              "updated_at": "2021-02-25T20:09:04.999Z",
            },
          ],
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.getAgents.mock.calls.length).toBe(1);
      expect(db.getAgents.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {},
        ]
      `);
    });

    test('post success', async () => {
      const method = 'post';
      const body = {
        ...agent,
        name: 'Secret Agent'
      };
      const response = await request({ path, method, body });
      expect(await response.json()).toMatchInlineSnapshot(`
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
              "id": 18,
              "name": "ChatPrompt",
              "updated_at": null,
            },
            "is_active": true,
            "name": "Secret Agent",
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
              "path": "/foo/bar/baz",
            },
            "updated_at": "2021-02-25T20:09:04.999Z",
          },
        }
      `);
      expect(db.createAgent.mock.calls.length).toBe(1);
      expect(db.createAgent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
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
              "id": 18,
              "name": "ChatPrompt",
              "updated_at": null,
            },
            "is_active": true,
            "name": "Secret Agent",
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
              "path": "/foo/bar/baz",
            },
            "updated_at": "2021-02-25T20:09:04.999Z",
          },
        ]
      `);
    });

    test('post failure, missing requirements', async () => {
      db.createAgent.mockImplementation(async props => null);

      const method = 'post';
      const body = {
        name: ''
      };
      const response = await request({ path, method, body, status: 500 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Creating an agent requires an owner, name and description.",
        }
      `);
      expect(db.createAgent.mock.calls.length).toBe(0);
    });

    test('post failure', async () => {
      db.createAgent.mockImplementation(async props => null);

      const method = 'post';
      const body = {
        ...agent,
        name: 'Secret Agent',
        owner: null
      };
      const response = await request({ path, method, body, status: 500 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Creating an agent requires an owner, name and description.",
        }
      `);
      expect(db.createAgent.mock.calls.length).toBe(0);
    });
  });

  describe('/api/agents/:id', () => {
    const path = '/api/agents/1';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
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
              "id": 18,
              "name": "ChatPrompt",
              "updated_at": null,
            },
            "is_active": true,
            "name": "Emoji Analysis",
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
              "path": "/foo/bar/baz",
            },
            "updated_at": "2021-02-25T20:09:04.999Z",
          },
        }
      `);
      expect(db.getAgent.mock.calls.length).toBe(1);
      expect(db.getAgent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
        ]
      `);
    });
  });

  describe('/api/agents/:id', () => {
    const path = '/api/agents/1';
    const method = 'put';

    test('put success', async () => {
      const body = {
        ...agent
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
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
              "id": 18,
              "name": "ChatPrompt",
              "updated_at": null,
            },
            "is_active": true,
            "name": "Emoji Analysis",
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
              "path": "/foo/bar/baz",
            },
            "updated_at": "2021-02-25T20:09:04.999Z",
          },
        }
      `);
      expect(db.setAgent.mock.calls.length).toBe(1);
      expect(db.setAgent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
          Object {
            "deleted_at": null,
            "description": "Detects the presense of an emoji character in your text",
            "endpoint": "ws://emoji-analysis-production.herokuapp.com",
            "name": "Emoji Analysis",
          },
        ]
      `);
    });

    test('put success (soft delete)', async () => {
      const body = {
        deleted_at: '2020-11-16T14:52:28.429Z'
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
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
              "id": 18,
              "name": "ChatPrompt",
              "updated_at": null,
            },
            "is_active": true,
            "name": "Emoji Analysis",
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
              "path": "/foo/bar/baz",
            },
            "updated_at": "2021-02-25T20:09:04.999Z",
          },
        }
      `);
      expect(db.setAgent.mock.calls.length).toBe(1);
      expect(db.setAgent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
          Object {
            "deleted_at": "2020-11-16T14:52:28.429Z",
          },
        ]
      `);
    });

    test('put success (partial: no color)', async () => {
      const body = {
        ...agent
      };

      delete body.color;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
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
              "id": 18,
              "name": "ChatPrompt",
              "updated_at": null,
            },
            "is_active": true,
            "name": "Emoji Analysis",
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
              "path": "/foo/bar/baz",
            },
            "updated_at": "2021-02-25T20:09:04.999Z",
          },
        }
      `);
      expect(db.setAgent.mock.calls.length).toBe(1);
    });

    test('put success (partial: no description)', async () => {
      const body = {
        ...agent
      };

      delete body.description;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
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
              "id": 18,
              "name": "ChatPrompt",
              "updated_at": null,
            },
            "is_active": true,
            "name": "Emoji Analysis",
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
              "path": "/foo/bar/baz",
            },
            "updated_at": "2021-02-25T20:09:04.999Z",
          },
        }
      `);
      expect(db.setAgent.mock.calls.length).toBe(1);
    });

    test('put success (partial: no name)', async () => {
      const body = {
        ...agent
      };

      delete body.name;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
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
              "id": 18,
              "name": "ChatPrompt",
              "updated_at": null,
            },
            "is_active": true,
            "name": "Emoji Analysis",
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
              "path": "/foo/bar/baz",
            },
            "updated_at": "2021-02-25T20:09:04.999Z",
          },
        }
      `);
      expect(db.setAgent.mock.calls.length).toBe(1);
    });

    test('put success (irrelevant data)', async () => {
      const body = {
        foo: 1
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
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
              "id": 18,
              "name": "ChatPrompt",
              "updated_at": null,
            },
            "is_active": true,
            "name": "Emoji Analysis",
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
              "path": "/foo/bar/baz",
            },
            "updated_at": "2021-02-25T20:09:04.999Z",
          },
        }
      `);
      expect(db.setAgent.mock.calls.length).toBe(0);
      expect(db.getAgent.mock.calls.length).toBe(1);
    });

    test('put failure (set interaction fails)', async () => {
      const status = 500;
      const body = {
        ...agent
      };

      db.setAgentInteraction.mockImplementation(async () => {
        throw error;
      });

      const response = await request({ path, method, body, status });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Agent interaction could not be set. something unexpected happened",
        }
      `);
      expect(db.setAgent.mock.calls.length).toBe(1);
      expect(db.setAgentInteraction.mock.calls.length).toBe(1);
    });

    test('put failure (set socket configuration fails)', async () => {
      const status = 500;
      const body = {
        ...agent
      };

      db.setAgentSocketConfiguration.mockImplementation(async () => {
        throw error;
      });

      const response = await request({ path, method, body, status });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Agent socket configuration could not be set. something unexpected happened",
        }
      `);
      expect(db.setAgent.mock.calls.length).toBe(1);
      expect(db.setAgentSocketConfiguration.mock.calls.length).toBe(1);
    });

    test('put failure (set configuration fails)', async () => {
      const status = 500;
      const body = {
        ...agent
      };

      db.setAgentConfiguration.mockImplementation(async () => {
        throw error;
      });

      const response = await request({ path, method, body, status });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Agent configuration could not be set. something unexpected happened",
        }
      `);
      expect(db.setAgent.mock.calls.length).toBe(1);
      expect(db.setAgentConfiguration.mock.calls.length).toBe(1);
    });

    test('put failure (set agent fails)', async () => {
      const status = 500;
      const body = {
        ...agent
      };

      db.setAgent.mockImplementation(async () => {
        throw error;
      });

      const response = await request({ path, method, body, status });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Agent could not be updated. something unexpected happened",
        }
      `);
      expect(db.setAgent.mock.calls.length).toBe(1);
    });
  });

  describe('/api/agents/is_active', () => {
    const path = '/api/agents/is_active';

    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "agents": Array [
            Object {
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
                "id": 18,
                "name": "ChatPrompt",
                "updated_at": null,
              },
              "is_active": true,
              "name": "Emoji Analysis",
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
                "path": "/foo/bar/baz",
              },
              "updated_at": "2021-02-25T20:09:04.999Z",
            },
          ],
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.getAgents.mock.calls.length).toBe(1);
      expect(db.getAgents.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "is_active": true,
          },
        ]
      `);
    });
  });

  describe('/api/agents/interactions', () => {
    const path = '/api/agents/interactions';

    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "interactions": Array [
            Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "id": 1,
              "name": "ChatPrompt",
              "updated_at": null,
            },
            Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "id": 2,
              "name": "AudioPrompt",
              "updated_at": null,
            },
            Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "id": 3,
              "name": "TextPrompt",
              "updated_at": null,
            },
          ],
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.getInteractions.mock.calls.length).toBe(1);
      expect(db.getInteractions.mock.calls[0]).toMatchInlineSnapshot(
        `Array []`
      );
    });

    test('get failure', async () => {
      const status = 500;

      db.getInteractions.mockImplementation(async () => {
        throw error;
      });

      const response = await request({ path, status });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "something unexpected happened",
        }
      `);
      expect(db.getInteractions.mock.calls.length).toBe(1);
    });
  });
});
