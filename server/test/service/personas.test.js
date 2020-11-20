import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/personas/db';
import * as ep from '../../service/personas/endpoints';

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

const teacher = {
  id: 1,
  name: 'Teacher',
  description: 'This is a teacher.',
  color: '#ff0000',
  author_id: 999,
  created_at: '2020-11-13T14:52:28.429Z',
  updated_at: null,
  deleted_at: null
};

const student = {
  id: 2,
  name: 'Student',
  description: 'This is a student.',
  color: '#ff0000',
  author_id: 999,
  created_at: '2020-11-13T14:55:28.429Z',
  updated_at: null,
  deleted_at: null
};

const link = {
  scenario_id: 42,
  persona_id: 2,
  is_default: false,
  created_at: '2020-11-13T14:55:28.429Z',
  updated_at: null,
  deleted_at: null
};

const personas = [teacher, student];
const personasById = {
  [teacher.id]: teacher,
  [student.id]: student
};

const scenario = {
  id: 42,
  title: 'Multiplayer Scenario',
  description: 'A scenario about "Multiplayer Scenario"',
  created_at: '2020-02-31T17:50:28.029Z',
  updated_at: null,
  deleted_at: null,
  status: 1,
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
  consent: {
    id: 57,
    prose:
      '<p>Educators and researchers in the <a href="http://tsl.mit.edu/">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href="https://couhes.mit.edu/">MIT\'s IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>'
  },
  finish: {
    id: 1,
    title: '',
    components: [
      {
        html: '<h2>Thanks for participating!</h2>',
        type: 'Text'
      }
    ],
    is_finish: true
  },
  lock: {
    scenario_id: 42,
    user_id: 999,
    created_at: '2020-01-01T23:54:19.934Z',
    ended_at: null
  },
  personas: [teacher]
};

const scenariosById = {
  [scenario.id]: scenario
};

jest.mock('../../service/personas/db', () => {
  return {
    ...jest.requireActual('../../service/personas/db'),
    createPersona: jest.fn(),
    deletePersonaById: jest.fn(),
    getPersonaById: jest.fn(),
    getPersonas: jest.fn(),
    getPersonasByScenarioId: jest.fn(),
    getPersonasByUserId: jest.fn(),
    linkPersonaToScenario: jest.fn(),
    setPersonaById: jest.fn()
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

import * as amw from '../../service/auth/middleware';
jest.mock('../../service/auth/middleware', () => {
  const amw = jest.requireActual('../../service/auth/middleware');
  return {
    ...amw,
    requireUser: jest.fn()
  };
});

describe('/api/personas/*', () => {
  let persona = null;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    amw.requireUser.mockImplementation((req, res, next) => {
      req.session.user = user;
      next();
    });

    db.createPersona.mockImplementation(async props => props);
    db.setPersonaById.mockImplementation(async () => persona);
    db.getPersonaById.mockImplementation(async id => {
      return personasById[id];
    });
    db.deletePersonaById.mockImplementation(async () => ({
      ...persona,
      deleted_at: '2020-11-16T14:52:28.429Z'
    }));
    db.linkPersonaToScenario.mockImplementation(async () => [teacher, student]);
    db.getPersonas.mockImplementation(async () => [teacher, student]);
    db.getPersonasByScenarioId.mockImplementation(
      async () => scenario.personas
    );
    db.getPersonasByUserId.mockImplementation(async () => [teacher, student]);

    rolesmw.requireUserRole.mockImplementation(() => [
      (req, res, next) => next()
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/personas/', () => {
    const path = '/api/personas/';

    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "personas": Array [
            Object {
              "author_id": 999,
              "color": "#ff0000",
              "created_at": "2020-11-13T14:52:28.429Z",
              "deleted_at": null,
              "description": "This is a teacher.",
              "id": 1,
              "name": "Teacher",
              "updated_at": null,
            },
            Object {
              "author_id": 999,
              "color": "#ff0000",
              "created_at": "2020-11-13T14:55:28.429Z",
              "deleted_at": null,
              "description": "This is a student.",
              "id": 2,
              "name": "Student",
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getPersonas.mock.calls.length).toBe(1);
      expect(db.getPersonas.mock.calls[0]).toMatchInlineSnapshot(`Array []`);
    });

    test('post success', async () => {
      const method = 'post';
      const body = {
        ...teacher,
        name: 'Fourth Grade Teacher'
      };
      const response = await request({ path, method, body });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "persona": Object {
            "author_id": 999,
            "color": "#ff0000",
            "description": "This is a teacher.",
            "name": "Fourth Grade Teacher",
          },
        }
      `);
      expect(db.createPersona.mock.calls.length).toBe(1);
      expect(db.createPersona.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "author_id": 999,
            "color": "#ff0000",
            "description": "This is a teacher.",
            "name": "Fourth Grade Teacher",
            "scenario_id": undefined,
          },
        ]
      `);
    });

    test('post failure, missing requirements', async () => {
      db.createPersona.mockImplementation(async props => null);

      const method = 'post';
      const body = {
        name: ''
      };
      const response = await request({ path, method, body, status: 422 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Creating a persona requires a user id, name, color and description.",
        }
      `);
      expect(db.createPersona.mock.calls.length).toBe(0);
    });

    test('post failure', async () => {
      db.createPersona.mockImplementation(async props => null);

      const method = 'post';
      const body = {
        ...teacher,
        name: 'Fourth Grade Teacher'
      };
      const response = await request({ path, method, body, status: 409 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Persona could not be created.",
        }
      `);
      expect(db.createPersona.mock.calls.length).toBe(1);
      expect(db.createPersona.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "author_id": 999,
            "color": "#ff0000",
            "description": "This is a teacher.",
            "name": "Fourth Grade Teacher",
            "scenario_id": undefined,
          },
        ]
      `);
    });
  });

  describe('/api/personas/my', () => {
    const path = '/api/personas/my';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "personas": Array [
            Object {
              "author_id": 999,
              "color": "#ff0000",
              "created_at": "2020-11-13T14:52:28.429Z",
              "deleted_at": null,
              "description": "This is a teacher.",
              "id": 1,
              "name": "Teacher",
              "updated_at": null,
            },
            Object {
              "author_id": 999,
              "color": "#ff0000",
              "created_at": "2020-11-13T14:55:28.429Z",
              "deleted_at": null,
              "description": "This is a student.",
              "id": 2,
              "name": "Student",
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getPersonasByUserId.mock.calls.length).toBe(1);
      expect(db.getPersonasByUserId.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
        ]
      `);
    });
  });

  describe('/api/personas/user/:id', () => {
    const path = '/api/personas/user/999';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "personas": Array [
            Object {
              "author_id": 999,
              "color": "#ff0000",
              "created_at": "2020-11-13T14:52:28.429Z",
              "deleted_at": null,
              "description": "This is a teacher.",
              "id": 1,
              "name": "Teacher",
              "updated_at": null,
            },
            Object {
              "author_id": 999,
              "color": "#ff0000",
              "created_at": "2020-11-13T14:55:28.429Z",
              "deleted_at": null,
              "description": "This is a student.",
              "id": 2,
              "name": "Student",
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getPersonasByUserId.mock.calls.length).toBe(1);
      expect(db.getPersonasByUserId.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
        ]
      `);
    });
  });

  describe('/api/personas/scenario/:id', () => {
    const path = '/api/personas/scenario/42';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "personas": Array [
            Object {
              "author_id": 999,
              "color": "#ff0000",
              "created_at": "2020-11-13T14:52:28.429Z",
              "deleted_at": null,
              "description": "This is a teacher.",
              "id": 1,
              "name": "Teacher",
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getPersonasByScenarioId.mock.calls.length).toBe(1);
      expect(db.getPersonasByScenarioId.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          42,
        ]
      `);
    });
  });

  describe('/api/personas/:id', () => {
    const path = '/api/personas/1';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "persona": Object {
            "author_id": 999,
            "color": "#ff0000",
            "created_at": "2020-11-13T14:52:28.429Z",
            "deleted_at": null,
            "description": "This is a teacher.",
            "id": 1,
            "name": "Teacher",
            "updated_at": null,
          },
        }
      `);
      expect(db.getPersonaById.mock.calls.length).toBe(1);
      expect(db.getPersonaById.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
        ]
      `);
    });
  });

  describe('/api/personas/:id', () => {
    const path = '/api/personas/2';
    const method = 'put';

    test('put success', async () => {
      const body = {
        ...teacher
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "persona": null,
        }
      `);
      expect(db.setPersonaById.mock.calls.length).toBe(1);
      expect(db.setPersonaById.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "color": "#ff0000",
            "description": "This is a teacher.",
            "name": "Teacher",
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
          "persona": null,
        }
      `);
      expect(db.setPersonaById.mock.calls.length).toBe(1);
      expect(db.setPersonaById.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "deleted_at": "2020-11-16T14:52:28.429Z",
          },
        ]
      `);
    });

    test('put success (partial: no color)', async () => {
      const body = {
        ...teacher
      };

      delete body.color;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "persona": null,
        }
      `);
      expect(db.setPersonaById.mock.calls.length).toBe(1);
    });

    test('put success (partial: no description)', async () => {
      const body = {
        ...teacher
      };

      delete body.description;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "persona": null,
        }
      `);
      expect(db.setPersonaById.mock.calls.length).toBe(1);
    });

    test('put success (partial: no name)', async () => {
      const body = {
        ...teacher
      };

      delete body.name;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "persona": null,
        }
      `);
      expect(db.setPersonaById.mock.calls.length).toBe(1);
    });

    test('put success (irrelevant data)', async () => {
      const body = {
        foo: 1
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "persona": Object {
            "author_id": 999,
            "color": "#ff0000",
            "created_at": "2020-11-13T14:55:28.429Z",
            "deleted_at": null,
            "description": "This is a student.",
            "id": 2,
            "name": "Student",
            "updated_at": null,
          },
        }
      `);
      expect(db.setPersonaById.mock.calls.length).toBe(0);
      expect(db.getPersonaById.mock.calls.length).toBe(1);
    });

    test('put failure', async () => {
      db.linkPersonaToScenario.mockImplementation(async () => null);

      const response = await request({ path, method, status: 500 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "No request body!",
        }
      `);
      expect(db.setPersonaById.mock.calls.length).toBe(0);
    });
  });

  describe('/api/personas/:id/scenario/:scenario_id', () => {
    const path = '/api/personas/2/scenario/42';
    const method = 'put';

    test('put success', async () => {
      const response = await request({ path, method });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "personas": Array [
            Object {
              "author_id": 999,
              "color": "#ff0000",
              "created_at": "2020-11-13T14:52:28.429Z",
              "deleted_at": null,
              "description": "This is a teacher.",
              "id": 1,
              "name": "Teacher",
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getPersonasByScenarioId.mock.calls.length).toBe(1);
      expect(db.getPersonasByScenarioId.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          42,
        ]
      `);
    });

    test('put failure', async () => {
      db.linkPersonaToScenario.mockImplementation(async () => null);

      const response = await request({ path, method, status: 500 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Persona could not be linked to scenario.",
        }
      `);
      expect(db.getPersonasByScenarioId.mock.calls.length).toBe(0);
    });
  });
});
