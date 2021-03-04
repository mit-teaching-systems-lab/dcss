import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/interactions/db';
import * as ep from '../../service/interactions/endpoints';

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

const interaction = {
  id: 1,
  created_at: '2021-02-25T17:31:33.826Z',
  updated_at: null,
  deleted_at: null,
  name: 'ChatPrompt',
  description:
    'It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.',
  owner: user,
  types: ['ChatPrompt']
};

const interactions = [
  {
    id: 1,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: null,
    deleted_at: null,
    name: 'ChatPrompt',
    description:
      'It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.',
    owner: user,
    types: ['ChatPrompt']
  },
  {
    id: 2,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: null,
    deleted_at: null,
    name: 'AudioPrompt',
    description:
      'It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Audio Prompt Responses.',
    owner: user,
    types: ['ChatPrompt', 'ConversationPrompt']
  },
  {
    id: 3,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: null,
    deleted_at: null,
    name: 'TextPrompt',
    description:
      'It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Text Prompt Responses.',
    owner: user,
    types: ['TextResponse']
  }
];

const interactionsById = interactions.reduce(
  (accum, interaction) => ({
    ...accum,
    [interaction.id]: interaction
  }),
  {}
);

const types = [
  {
    id: 1,
    name: 'AudioPrompt'
  },
  {
    id: 2,
    name: 'ChatPrompt'
  },
  {
    id: 3,
    name: 'ConversationPrompt'
  },
  {
    id: 4,
    name: 'TextResponse'
  }
];

jest.mock('../../service/interactions/db', () => {
  return {
    ...jest.requireActual('../../service/interactions/db'),
    createInteraction: jest.fn(),
    getInteraction: jest.fn(),
    getInteractions: jest.fn(),
    getInteractionsTypes: jest.fn(),
    setInteraction: jest.fn()
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

describe('/api/interactions/*', () => {
  let persona = null;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    authmw.requireUser.mockImplementation((req, res, next) => {
      req.session.user = user;
      next();
    });

    db.createInteraction.mockImplementation(async props => props);
    db.getInteractions.mockImplementation(async () => [interaction]);
    db.getInteraction.mockImplementation(async id => {
      return interactionsById[id];
    });
    db.setInteraction.mockImplementation(async props => props);
    db.getInteractions.mockImplementation(async () => interactions);
    db.getInteractionsTypes.mockImplementation(async () => types);

    rolesmw.requireUserRole.mockImplementation(() => [
      (req, res, next) => {
        req.session.user = user;
        next();
      }
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/interactions', () => {
    const path = '/api/interactions';

    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "interactions": Array [
            Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
              "id": 1,
              "name": "ChatPrompt",
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
              "types": Array [
                "ChatPrompt",
              ],
              "updated_at": null,
            },
            Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "description": "It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Audio Prompt Responses.",
              "id": 2,
              "name": "AudioPrompt",
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
              "types": Array [
                "ChatPrompt",
                "ConversationPrompt",
              ],
              "updated_at": null,
            },
            Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "description": "It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Text Prompt Responses.",
              "id": 3,
              "name": "TextPrompt",
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
              "types": Array [
                "TextResponse",
              ],
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

    test('post success', async () => {
      const method = 'post';
      const body = {
        ...interaction,
        name: 'secret-interaction'
      };

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "interaction": Object {
            "created_at": "2021-02-25T17:31:33.826Z",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "secret-interaction",
            "owner": Object {
              "id": 999,
            },
            "types": Array [
              "ChatPrompt",
            ],
            "updated_at": null,
          },
        }
      `);
      expect(db.createInteraction.mock.calls.length).toBe(1);
      expect(db.createInteraction.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "created_at": "2021-02-25T17:31:33.826Z",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "secret-interaction",
            "owner": Object {
              "id": 999,
            },
            "types": Array [
              "ChatPrompt",
            ],
            "updated_at": null,
          },
        ]
      `);
    });

    test('post failure, missing requirements (types)', async () => {
      db.createInteraction.mockImplementation(async props => null);

      const method = 'post';
      const body = {
        types: []
      };
      const response = await request({ path, method, body, status: 500 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Creating an interaction requires a name, description and list of prompts.",
        }
      `);
      expect(db.createInteraction.mock.calls.length).toBe(0);
    });

    test('post failure, missing requirements (name)', async () => {
      db.createInteraction.mockImplementation(async props => null);

      const method = 'post';
      const body = {
        title: 'Secret Interaction',
        name: ''
      };
      const response = await request({ path, method, body, status: 500 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Creating an interaction requires a name, description and list of prompts.",
        }
      `);
      expect(db.createInteraction.mock.calls.length).toBe(0);
    });
  });

  describe('/api/interactions/:id', () => {
    const path = '/api/interactions/1';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "interaction": Object {
            "created_at": "2021-02-25T17:31:33.826Z",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
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
            "types": Array [
              "ChatPrompt",
            ],
            "updated_at": null,
          },
        }
      `);
      expect(db.getInteraction.mock.calls.length).toBe(1);
      expect(db.getInteraction.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
        ]
      `);
    });
  });

  describe('/api/interactions/:id', () => {
    const path = '/api/interactions/1';
    const method = 'put';

    test('put success', async () => {
      const body = {
        ...interaction
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "interaction": Object {
            "created_at": "2021-02-25T17:31:33.826Z",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
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
            "types": Array [
              "ChatPrompt",
            ],
            "updated_at": null,
          },
        }
      `);
      expect(db.setInteraction.mock.calls.length).toBe(1);
      expect(db.setInteraction.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
          Object {
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "name": "ChatPrompt",
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
          "interaction": Object {
            "created_at": "2021-02-25T17:31:33.826Z",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
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
            "types": Array [
              "ChatPrompt",
            ],
            "updated_at": null,
          },
        }
      `);
      expect(db.setInteraction.mock.calls.length).toBe(1);
      expect(db.setInteraction.mock.calls[0]).toMatchInlineSnapshot(`
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
        ...interaction
      };

      delete body.color;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "interaction": Object {
            "created_at": "2021-02-25T17:31:33.826Z",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
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
            "types": Array [
              "ChatPrompt",
            ],
            "updated_at": null,
          },
        }
      `);
      expect(db.setInteraction.mock.calls.length).toBe(1);
    });

    test('put success (partial: no description)', async () => {
      const body = {
        ...interaction
      };

      delete body.description;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "interaction": Object {
            "created_at": "2021-02-25T17:31:33.826Z",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
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
            "types": Array [
              "ChatPrompt",
            ],
            "updated_at": null,
          },
        }
      `);
      expect(db.setInteraction.mock.calls.length).toBe(1);
    });

    test('put success (partial: no name)', async () => {
      const body = {
        ...interaction
      };

      delete body.name;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "interaction": Object {
            "created_at": "2021-02-25T17:31:33.826Z",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
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
            "types": Array [
              "ChatPrompt",
            ],
            "updated_at": null,
          },
        }
      `);
      expect(db.setInteraction.mock.calls.length).toBe(1);
    });

    test('put success (irrelevant data)', async () => {
      const body = {
        foo: 1
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "interaction": Object {
            "created_at": "2021-02-25T17:31:33.826Z",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
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
            "types": Array [
              "ChatPrompt",
            ],
            "updated_at": null,
          },
        }
      `);
      expect(db.setInteraction.mock.calls.length).toBe(0);
      expect(db.getInteraction.mock.calls.length).toBe(1);
    });
  });

  describe('/api/interactions', () => {
    const path = '/api/interactions';

    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "interactions": Array [
            Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
              "id": 1,
              "name": "ChatPrompt",
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
              "types": Array [
                "ChatPrompt",
              ],
              "updated_at": null,
            },
            Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "description": "It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Audio Prompt Responses.",
              "id": 2,
              "name": "AudioPrompt",
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
              "types": Array [
                "ChatPrompt",
                "ConversationPrompt",
              ],
              "updated_at": null,
            },
            Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "description": "It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Text Prompt Responses.",
              "id": 3,
              "name": "TextPrompt",
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
              "types": Array [
                "TextResponse",
              ],
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

  describe('/api/interactions/types', () => {
    const path = '/api/interactions/types';

    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "types": Array [
            Object {
              "id": 1,
              "name": "AudioPrompt",
            },
            Object {
              "id": 2,
              "name": "ChatPrompt",
            },
            Object {
              "id": 3,
              "name": "ConversationPrompt",
            },
            Object {
              "id": 4,
              "name": "TextResponse",
            },
          ],
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.getInteractionsTypes.mock.calls.length).toBe(1);
      expect(db.getInteractionsTypes.mock.calls[0]).toMatchInlineSnapshot(
        `Array []`
      );
    });
  });
});
