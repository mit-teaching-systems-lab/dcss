import { request } from '../';
import { asyncMiddleware } from '../../util/api';

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
  categories: ['Cool'],
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
  labels: ['a', 'b'],
  lock: {
    scenario_id: 42,
    user_id: 999,
    created_at: '2020-01-01T23:54:19.934Z',
    ended_at: null
  },
  personas: [teacher, student]
};

const scenariosById = {
  [scenario.id]: scenario
};

import * as slidesdb from '../../service/scenarios/slides/db';
jest.mock('../../service/scenarios/slides/db', () => {
  return {
    ...jest.requireActual('../../service/scenarios/slides/db'),
    getScenarioSlides: jest.fn(),
    createSlide: jest.fn(),
    setSlide: jest.fn(),
    setAllSlides: jest.fn(),
    deleteSlide: jest.fn(),
    setSlideOrder: jest.fn()
  };
});

jest.mock('../../service/scenarios/db', () => {
  return {
    ...jest.requireActual('../../service/scenarios/db'),
    createScenario: jest.fn(),
    setScenario: jest.fn(),
    getScenario: jest.fn(),
    deleteScenario: jest.fn(),
    softDeleteScenario: jest.fn(),
    getHistoryForScenario: jest.fn(),
    getScenarioByRun: jest.fn(),
    getScenarioPrompts: jest.fn(),
    getScenarios: jest.fn(),
    getScenariosByStatus: jest.fn(),
    getScenariosCount: jest.fn(),
    getScenariosSlice: jest.fn(),
    createScenarioSnapshot: jest.fn(),
    createScenarioLock: jest.fn(),
    getScenarioLock: jest.fn(),
    endScenarioLock: jest.fn(),
    getScenarioUserRoles: jest.fn(),
    setScenarioUserRole: jest.fn(),
    endScenarioUserRole: jest.fn(),
    createScenarioConsent: jest.fn(),
    setScenarioConsent: jest.fn(),
    getScenarioConsent: jest.fn(),
    setScenarioCategories: jest.fn(),
    setScenarioLabels: jest.fn(),
    setScenarioPersonas: jest.fn()
  };
});

import * as amw from '../../service/auth/middleware';
jest.mock('../../service/auth/middleware', () => {
  const amw = jest.requireActual('../../service/auth/middleware');
  return {
    ...amw,
    requireUser: jest.fn((req, res, next) => next())
  };
});

import * as rolesmw from '../../service/roles/middleware';
jest.mock('../../service/roles/middleware', () => {
  const rolesmw = jest.requireActual('../../service/roles/middleware');
  return {
    ...rolesmw,
    requireUserRole: jest.fn(() => [
      (req, res, next) => {
        req.session.user = {
          id: 999,
          email: 'super@email.com',
          roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
          is_super: true,
          username: 'superuser',
          is_anonymous: false,
          personalname: 'Super User'
        };
        next();
      }
    ])
  };
});

import * as smw from '../../service/scenarios/middleware';
jest.mock('../../service/scenarios/middleware', () => {
  const smw = jest.requireActual('../../service/scenarios/middleware');
  return {
    ...smw,
    requestScenario: jest.fn(() => {}),
    lookupScenario: jest.fn(() => []),
    requireScenarioUserRole: jest.fn(() => [])
  };
});

import * as db from '../../service/scenarios/db';
import * as ep from '../../service/scenarios/endpoints';

describe('/api/scenarios/*', () => {
  let persona = null;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    amw.requireUser.mockImplementation((req, res, next) => {
      req.session.user = user;
      next();
    });

    smw.requestScenario.mockImplementation((req, res, next) => {
      return scenario;
    });
    smw.lookupScenario.mockImplementation(() => [(req, res, next) => next()]);
    smw.requireScenarioUserRole.mockImplementation(() => [
      (req, res, next) => {
        req.session.user = user;
        next();
      }
    ]);

    db.createScenario.mockImplementation(async props => props);
    db.setScenario.mockImplementation(async props => props);
    db.getScenarios.mockImplementation(async () => [scenario]);
    db.createScenarioConsent.mockImplementation(
      async props => scenario.consent
    );
    db.setScenarioConsent.mockImplementation(async props => props);

    slidesdb.createSlide.mockImplementation(async props => {
      return props;
    });

    slidesdb.setSlide.mockImplementation(async (id, props) => props);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/scenarios/', () => {
    const path = '/api/scenarios/';

    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "scenarios": Array [
            Object {
              "author": Object {
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
                "username": "super",
              },
              "categories": Array [
                "Cool",
              ],
              "consent": Object {
                "id": 57,
                "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
              },
              "created_at": "2020-02-31T17:50:28.029Z",
              "deleted_at": null,
              "description": "A scenario about \\"Multiplayer Scenario\\"",
              "finish": Object {
                "components": Array [
                  Object {
                    "html": "<h2>Thanks for participating!</h2>",
                    "type": "Text",
                  },
                ],
                "id": 1,
                "is_finish": true,
                "title": "",
              },
              "id": 42,
              "labels": Array [
                "a",
                "b",
              ],
              "lock": Object {
                "created_at": "2020-01-01T23:54:19.934Z",
                "ended_at": null,
                "scenario_id": 42,
                "user_id": 999,
              },
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
              "status": 1,
              "title": "Multiplayer Scenario",
              "updated_at": null,
              "users": Array [
                Object {
                  "email": "super@email.com",
                  "id": 999,
                  "is_author": true,
                  "is_reviewer": false,
                  "is_super": true,
                  "personalname": "Super User",
                  "roles": Array [
                    "super",
                  ],
                  "username": "super",
                },
              ],
            },
          ],
        }
      `);
      expect(db.getScenarios.mock.calls.length).toBe(1);
      expect(db.getScenarios.mock.calls[0]).toMatchInlineSnapshot(`Array []`);
    });

    test('post success', async () => {
      const method = 'post';
      const body = {
        title: 'A Title',
        author: {
          ...user
        },
        categories: []
      };
      const response = await request({ path, method, body, status: 201 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "scenario": 999,
        }
      `);
      expect(db.createScenario.mock.calls.length).toBe(1);
      expect(db.createScenario.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
          "A Title",
          undefined,
        ]
      `);
    });

    test('post failure, author missing', async () => {
      const method = 'post';
      const body = {
        title: 'A Title',
        categories: []
      };
      const response = await request({ path, method, body, status: 201 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "scenario": 999,
        }
      `);
      expect(db.createScenario.mock.calls.length).toBe(1);
      expect(db.createScenario.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
          "A Title",
          undefined,
        ]
      `);
    });

    test('post failure, title missing', async () => {
      db.createScenario.mockImplementation(async props => null);

      const method = 'post';
      const body = {
        description: 'A description',
        categories: []
      };

      const response = await request({ path, method, body, status: 422 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "A title must be provided to create a new scenario.",
        }
      `);
      expect(db.createScenario.mock.calls.length).toBe(0);
    });

    test('post failure', async () => {
      db.createScenario.mockImplementation(async props => {
        throw new Error('some other error');
      });

      const method = 'post';
      const body = {
        title: 'Title',
        author: {
          ...user
        },
        categories: []
      };

      const response = await request({ path, method, body, status: 500 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Error while creating scenario.",
        }
      `);
      expect(db.createScenario.mock.calls.length).toBe(1);
      expect(db.createScenario.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
          "Title",
          undefined,
        ]
      `);
    });
  });

  describe('/api/scenarios/:id', () => {
    const path = '/api/scenarios/1';
    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "scenario": Object {
            "author": Object {
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
              "username": "super",
            },
            "categories": Array [
              "Cool",
            ],
            "consent": Object {
              "id": 57,
              "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
            },
            "created_at": "2020-02-31T17:50:28.029Z",
            "deleted_at": null,
            "description": "A scenario about \\"Multiplayer Scenario\\"",
            "finish": Object {
              "components": Array [
                Object {
                  "html": "<h2>Thanks for participating!</h2>",
                  "type": "Text",
                },
              ],
              "id": 1,
              "is_finish": true,
              "title": "",
            },
            "id": 42,
            "labels": Array [
              "a",
              "b",
            ],
            "lock": Object {
              "created_at": "2020-01-01T23:54:19.934Z",
              "ended_at": null,
              "scenario_id": 42,
              "user_id": 999,
            },
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
            "status": 1,
            "title": "Multiplayer Scenario",
            "updated_at": null,
            "users": Array [
              Object {
                "email": "super@email.com",
                "id": 999,
                "is_author": true,
                "is_reviewer": false,
                "is_super": true,
                "personalname": "Super User",
                "roles": Array [
                  "super",
                ],
                "username": "super",
              },
            ],
          },
        }
      `);
    });

    test('put success', async () => {
      const path = '/api/scenarios/2';
      const method = 'put';
      const body = {
        ...scenario
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "scenario": 2,
        }
      `);

      expect(db.setScenario.mock.calls.length).toBe(1);
      expect(db.setScenario.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "author_id": 999,
            "deleted_at": null,
            "description": "A scenario about \\"Multiplayer Scenario\\"",
            "status": 1,
            "title": "Multiplayer Scenario",
          },
        ]
      `);

      expect(db.setScenarioLabels.mock.calls.length).toBe(1);
      expect(db.setScenarioLabels.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "a",
            "b",
          ],
        ]
      `);

      expect(db.setScenarioPersonas.mock.calls.length).toBe(1);
      expect(db.setScenarioPersonas.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
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
        ]
      `);

      expect(db.setScenarioCategories.mock.calls.length).toBe(1);
      expect(db.setScenarioCategories.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "Cool",
          ],
        ]
      `);
    });

    test('put success, no explicit author', async () => {
      const path = '/api/scenarios/2';
      const method = 'put';
      const body = {
        ...scenario
      };

      delete body.author;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "scenario": 2,
        }
      `);

      expect(db.setScenario.mock.calls.length).toBe(1);
      expect(db.setScenario.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "author_id": 999,
            "deleted_at": null,
            "description": "A scenario about \\"Multiplayer Scenario\\"",
            "status": 1,
            "title": "Multiplayer Scenario",
          },
        ]
      `);

      expect(db.setScenarioLabels.mock.calls.length).toBe(1);
      expect(db.setScenarioLabels.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "a",
            "b",
          ],
        ]
      `);

      expect(db.setScenarioPersonas.mock.calls.length).toBe(1);
      expect(db.setScenarioPersonas.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
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
        ]
      `);

      expect(db.setScenarioCategories.mock.calls.length).toBe(1);
      expect(db.setScenarioCategories.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "Cool",
          ],
        ]
      `);
    });

    test('put success, no explicit author or user', async () => {
      rolesmw.requireUserRole.mockImplementation(() => [
        (req, res, next) => {
          req.session.user = null;
          next();
        }
      ]);

      const path = '/api/scenarios/2';
      const method = 'put';
      const body = {
        ...scenario
      };

      delete body.author;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "scenario": 2,
        }
      `);

      expect(db.setScenario.mock.calls.length).toBe(1);
      expect(db.setScenario.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "author_id": 999,
            "deleted_at": null,
            "description": "A scenario about \\"Multiplayer Scenario\\"",
            "status": 1,
            "title": "Multiplayer Scenario",
          },
        ]
      `);

      expect(db.setScenarioLabels.mock.calls.length).toBe(1);
      expect(db.setScenarioLabels.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "a",
            "b",
          ],
        ]
      `);

      expect(db.setScenarioPersonas.mock.calls.length).toBe(1);
      expect(db.setScenarioPersonas.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
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
        ]
      `);

      expect(db.setScenarioCategories.mock.calls.length).toBe(1);
      expect(db.setScenarioCategories.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "Cool",
          ],
        ]
      `);
    });

    test('put success, author id missing', async () => {
      const path = '/api/scenarios/2';
      const method = 'put';
      const body = {
        ...scenario
      };

      body.author.id = null;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "scenario": 2,
        }
      `);

      expect(db.setScenario.mock.calls.length).toBe(1);
      expect(db.setScenario.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "author_id": 999,
            "deleted_at": null,
            "description": "A scenario about \\"Multiplayer Scenario\\"",
            "status": 1,
            "title": "Multiplayer Scenario",
          },
        ]
      `);

      expect(db.setScenarioLabels.mock.calls.length).toBe(1);
      expect(db.setScenarioLabels.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "a",
            "b",
          ],
        ]
      `);

      expect(db.setScenarioPersonas.mock.calls.length).toBe(1);
      expect(db.setScenarioPersonas.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
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
        ]
      `);

      expect(db.setScenarioCategories.mock.calls.length).toBe(1);
      expect(db.setScenarioCategories.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "Cool",
          ],
        ]
      `);
    });

    test('put success, finish id missing', async () => {
      const path = '/api/scenarios/2';
      const method = 'put';
      const body = {
        ...scenario
      };

      body.finish.id = null;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "scenario": 2,
        }
      `);

      expect(db.setScenario.mock.calls.length).toBe(1);
      expect(db.setScenario.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "author_id": 999,
            "deleted_at": null,
            "description": "A scenario about \\"Multiplayer Scenario\\"",
            "status": 1,
            "title": "Multiplayer Scenario",
          },
        ]
      `);

      expect(db.setScenarioLabels.mock.calls.length).toBe(1);
      expect(db.setScenarioLabels.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "a",
            "b",
          ],
        ]
      `);

      expect(db.setScenarioPersonas.mock.calls.length).toBe(1);
      expect(db.setScenarioPersonas.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
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
        ]
      `);

      expect(db.setScenarioCategories.mock.calls.length).toBe(1);
      expect(db.setScenarioCategories.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "Cool",
          ],
        ]
      `);
    });

    test('put success, finish id and components missing', async () => {
      const path = '/api/scenarios/2';
      const method = 'put';
      const body = {
        ...scenario
      };

      body.finish.id = null;
      body.finish.components = null;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "scenario": 2,
        }
      `);

      expect(db.setScenario.mock.calls.length).toBe(1);
      expect(db.setScenario.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "author_id": 999,
            "deleted_at": null,
            "description": "A scenario about \\"Multiplayer Scenario\\"",
            "status": 1,
            "title": "Multiplayer Scenario",
          },
        ]
      `);

      expect(db.setScenarioLabels.mock.calls.length).toBe(1);
      expect(db.setScenarioLabels.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "a",
            "b",
          ],
        ]
      `);

      expect(db.setScenarioPersonas.mock.calls.length).toBe(1);
      expect(db.setScenarioPersonas.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
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
        ]
      `);

      expect(db.setScenarioCategories.mock.calls.length).toBe(1);
      expect(db.setScenarioCategories.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "Cool",
          ],
        ]
      `);
    });

    test('put success, consent id missing', async () => {
      const path = '/api/scenarios/2';
      const method = 'put';
      const body = {
        ...scenario
      };

      body.consent.id = null;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "scenario": 2,
        }
      `);

      expect(db.setScenario.mock.calls.length).toBe(1);
      expect(db.setScenario.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "author_id": 999,
            "deleted_at": null,
            "description": "A scenario about \\"Multiplayer Scenario\\"",
            "status": 1,
            "title": "Multiplayer Scenario",
          },
        ]
      `);

      expect(db.setScenarioLabels.mock.calls.length).toBe(1);
      expect(db.setScenarioLabels.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "a",
            "b",
          ],
        ]
      `);

      expect(db.setScenarioPersonas.mock.calls.length).toBe(1);
      expect(db.setScenarioPersonas.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
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
        ]
      `);

      expect(db.setScenarioCategories.mock.calls.length).toBe(1);
      expect(db.setScenarioCategories.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Array [
            "Cool",
          ],
        ]
      `);
    });

    test('put failure, setScenario failure', async () => {
      db.setScenario.mockImplementation(async props => {
        throw new Error('bad things happened');
      });

      const path = '/api/scenarios/2';
      const method = 'put';
      const body = {
        ...scenario
      };

      const response = await request({ path, method, body, status: 500 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Error while updating scenario",
        }
      `);

      expect(db.setScenarioCategories.mock.calls.length).toBe(0);
      expect(db.setScenarioLabels.mock.calls.length).toBe(0);
      expect(db.setScenarioPersonas.mock.calls.length).toBe(0);
      expect(db.createScenarioConsent.mock.calls.length).toBe(0);
      expect(db.setScenarioConsent.mock.calls.length).toBe(0);

      expect(slidesdb.createSlide.mock.calls.length).toBe(0);
      expect(slidesdb.setSlide.mock.calls.length).toBe(0);
    });
  });
});
