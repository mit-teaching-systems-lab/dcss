import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/cohorts/db';
import * as ep from '../../service/cohorts/endpoints';

const error = new Error('something unexpected happened');

const superUser = {
  id: 999,
  email: 'super@email.com',
  roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
  username: 'super',
  is_super: true,
  is_anonymous: false,
  personalname: 'Super User'
};

const facilitatorUser = {
  id: 888,
  email: 'facilitator@email.com',
  roles: ['participant', 'facilitator'],
  username: 'facilitator',
  is_super: false,
  is_anonymous: false,
  personalname: 'Facilitator User'
};

const participantUser = {
  id: 777,
  email: 'participant@email.com',
  roles: ['participant'],
  username: 'participant',
  is_super: false,
  is_anonymous: false,
  personalname: 'Participant User'
};

const cohort = {
  id: 1,
  name: 'First Cohort',
  created_at: '2020-07-24T14:52:28.429Z',
  roles: ['owner', 'facilitator', 'participant'],
  users: [
    {
      id: 9,
      email: null,
      username: 'valuable-ram',
      roles: ['participant'],
      is_anonymous: true,
      is_owner: false
    },
    {
      id: 11,
      email: null,
      username: 'warmhearted-jackal',
      roles: ['participant'],
      is_anonymous: true,
      is_owner: false
    },
    {
      id: 12,
      email: null,
      username: 'super-insect',
      roles: ['participant'],
      is_anonymous: true,
      is_owner: false
    },
    superUser,
    facilitatorUser,
    participantUser
  ],
  usersById: {
    '999': superUser,
    '888': facilitatorUser,
    '777': participantUser,
    '9': {
      id: 9,
      email: null,
      username: 'valuable-ram',
      roles: ['participant'],
      is_anonymous: true,
      is_owner: false
    },
    '11': {
      id: 11,
      email: null,
      username: 'warmhearted-jackal',
      roles: ['participant'],
      is_anonymous: true,
      is_owner: false
    },
    '12': {
      id: 12,
      email: null,
      username: 'super-insect',
      roles: ['participant'],
      is_anonymous: true,
      is_owner: false
    }
  },
  runs: [
    {
      id: 11,
      user_id: 999,
      scenario_id: 7,
      created_at: '2020-07-28T19:44:03.069Z',
      updated_at: '2020-07-31T17:01:43.139Z',
      ended_at: '2020-07-31T17:01:43.128Z',
      consent_id: 8,
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      referrer_params: null,
      cohort_id: 1,
      run_id: 11
    },
    {
      id: 28,
      user_id: 9,
      scenario_id: 7,
      created_at: '2020-07-31T17:01:52.908Z',
      updated_at: '2020-07-31T17:02:00.309Z',
      ended_at: '2020-07-31T17:02:00.296Z',
      consent_id: 8,
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      referrer_params: null,
      cohort_id: 1,
      run_id: 28
    },
    {
      id: 29,
      user_id: 11,
      scenario_id: 7,
      created_at: '2020-07-31T17:02:51.357Z',
      updated_at: '2020-07-31T17:02:57.054Z',
      ended_at: '2020-07-31T17:02:57.043Z',
      consent_id: 8,
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      referrer_params: null,
      cohort_id: 1,
      run_id: 29
    }
  ],
  scenarios: [7, 1, 9, 8]
};

const cohorts = [cohort];

import * as amw from '../../service/auth/middleware';
jest.mock('../../service/auth/middleware', () => {
  const amw = jest.requireActual('../../service/auth/middleware');
  return {
    ...amw,
    requireUser: jest.fn()
  };
});
import * as adb from '../../service/auth/db';
jest.mock('../../service/auth/db', () => {
  const adb = jest.requireActual('../../service/auth/db');
  return {
    ...adb,
    getUserById: jest.fn()
  };
});

const cohortsdb = jest.requireActual('../../service/cohorts/db');
jest.mock('../../service/cohorts/db', () => {
  return {
    ...jest.requireActual('../../service/cohorts/db'),
    createCohort: jest.fn(),
    getCohort: jest.fn(),
    __getAggregatedCohort: jest.fn(),
    __getCohorts: jest.fn(),
    getCohorts: jest.fn(),
    setCohort: jest.fn(),
    setCohortScenarios: jest.fn(),
    getCohortRunResponses: jest.fn(),
    linkCohortToRun: jest.fn(),
    getCohortUserRoles: jest.fn(),
    linkUserToCohort: jest.fn(),
    addCohortUserRole: jest.fn(),
    deleteCohortUserRole: jest.fn()
  };
});

import * as cohortsmw from '../../service/cohorts/middleware';
jest.mock('../../service/cohorts/middleware', () => {
  const cohortsmw = jest.requireActual('../../service/cohorts/middleware');
  return {
    ...cohortsmw,
    requireCohortUserRole: jest.fn(roles => [
      jest.fn((req, res, next) => next()),
      jest.fn((req, res, next) => next())
    ])
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

import * as runsmw from '../../service/runs/middleware';
jest.mock('../../service/runs/middleware', () => {
  const runsmw = jest.requireActual('../../service/runs/middleware');
  return {
    ...runsmw,
    requireUserForRun: jest.fn((req, res, next) => next())
  };
});

import * as sdb from '../../service/scenarios/db';
jest.mock('../../service/scenarios/db', () => {
  const sdb = jest.requireActual('../../service/scenarios/db');
  return {
    ...sdb,
    getScenarioPrompts: jest.fn()
  };
});

describe('/api/cohorts/*', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    adb.getUserById.mockImplementation(async () => superUser);
    amw.requireUser.mockImplementation((req, res, next) => {
      req.session.user = superUser;
      next();
    });

    db.createCohort.mockImplementation(async (name, user_id) => ({
      ...cohort,
      name
    }));
    db.setCohort.mockImplementation(async () => cohort);
    db.getCohort.mockImplementation(async () => cohort);
    db.linkCohortToRun.mockImplementation(async () => cohort);
    db.setCohortScenarios.mockImplementation(
      async (id, scenarioIds) => scenarioIds
    );
    db.addCohortUserRole.mockImplementation(async () => ({ addedCount: 1 }));
    db.deleteCohortUserRole.mockImplementation(async () => ({
      deletedCount: 1
    }));
    db.getCohortRunResponses.mockImplementation(async () => [
      { response_id: 1, scenario_id: 42 }
    ]);

    db.__getAggregatedCohort.mockImplementation(async () => cohort);
    db.__getCohorts.mockImplementation(async () => [cohort]);
    db.getCohorts.mockImplementation(async () => [cohort]);

    db.linkUserToCohort.mockImplementation(async id => {
      const { users, usersById } = cohort;
      return {
        users,
        usersById
      };
    });

    sdb.getScenarioPrompts.mockImplementation(async (name, user_id) => [
      { id: 'x' },
      { id: 'y' },
      { id: 'z' }
    ]);
    rolesmw.requireUserRole.mockImplementation(() => [
      (req, res, next) => next()
    ]);
    runsmw.requireUserForRun.mockImplementation(async (req, res, next) =>
      next()
    );
    cohortsmw.requireCohortUserRole.mockImplementation(() => [
      (req, res, next) => next()
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/cohorts', () => {
    const path = '/api/cohorts';

    test('post success', async () => {
      const method = 'post';
      const body = { name: 'A New Cohort' };
      const response = await request({ path, method, body });
      expect(await response.json()).toMatchSnapshot();
      expect(db.createCohort.mock.calls.length).toBe(1);
      expect(db.createCohort.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "A New Cohort",
          999,
        ]
      `);
    });

    describe('get', () => {
      test('get success, super', async () => {
        amw.requireUser.mockImplementation((req, res, next) => {
          req.session.user = superUser;
          next();
        });

        const response = await request({ path });
        expect(await response.json()).toMatchSnapshot();
        expect(db.getCohorts.mock.calls.length).toBe(1);
        expect(db.getCohorts.mock.calls[0]).toMatchInlineSnapshot(`
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
                "facilitator",
                "researcher",
              ],
              "username": "super",
            },
          ]
        `);
      });

      test('get success, facilitator', async () => {
        amw.requireUser.mockImplementation((req, res, next) => {
          req.session.user = facilitatorUser;
          next();
        });

        const response = await request({ path });
        expect(await response.json()).toMatchSnapshot();
        expect(db.getCohorts.mock.calls.length).toBe(1);
        expect(db.getCohorts.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            Object {
              "email": "facilitator@email.com",
              "id": 888,
              "is_anonymous": false,
              "is_super": false,
              "personalname": "Facilitator User",
              "roles": Array [
                "participant",
                "facilitator",
              ],
              "username": "facilitator",
            },
          ]
        `);
      });

      test('get success, participant', async () => {
        amw.requireUser.mockImplementation((req, res, next) => {
          req.session.user = participantUser;
          next();
        });

        const response = await request({ path });
        expect(await response.json()).toMatchSnapshot();
        expect(db.getCohorts.mock.calls.length).toBe(1);
        expect(db.getCohorts.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            Object {
              "email": "participant@email.com",
              "id": 777,
              "is_anonymous": false,
              "is_super": false,
              "personalname": "Participant User",
              "roles": Array [
                "participant",
              ],
              "username": "participant",
            },
          ]
        `);
      });
    });
  });

  describe('/api/cohorts/:id', () => {
    const path = '/api/cohorts/1';

    beforeEach(() => {
      rolesmw.requireUserRole.mockImplementation(() => [
        (req, res, next) => {
          next();
        }
      ]);
    });

    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchSnapshot();
      expect(db.getCohort.mock.calls.length).toBe(1);
      expect(db.getCohort.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
        ]
      `);
    });

    describe('put success', () => {
      const method = 'put';

      test('has updates', async () => {
        const body = { name: 'x', deleted_at: 'y' };
        const response = await request({ path, method, body });
        expect(await response.json()).toMatchSnapshot();
        expect(db.getCohort.mock.calls.length).toBe(0);
        expect(db.setCohort.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            1,
            Object {
              "deleted_at": "y",
              "name": "x",
            },
          ]
        `);
      });

      test('no updates', async () => {
        const body = {};
        const response = await request({ path, method, body });
        expect(await response.json()).toMatchSnapshot();
        expect(db.setCohort.mock.calls.length).toBe(0);
        expect(db.getCohort.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            1,
          ]
        `);
      });
    });

    describe('/api/cohorts/:id/scenarios', () => {
      const path = '/api/cohorts/1/scenarios';
      const method = 'put';

      test('put success', async () => {
        const body = { scenarios: [10, 20, 30] };
        const response = await request({ path, method, body });
        expect(await response.json()).toMatchSnapshot();
        expect(db.setCohortScenarios.mock.calls.length).toBe(1);
        expect(db.setCohortScenarios.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            1,
            Array [
              10,
              20,
              30,
            ],
          ]
        `);
      });
    });
  });

  describe('/api/cohorts/:id/scenario/:scenario_id/:user_id (get)', () => {
    const path = '/api/cohorts/1/scenario/42/999';

    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchSnapshot();
      expect(db.getCohortRunResponses.mock.calls.length).toBe(1);
      expect(db.getCohortRunResponses.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "1",
            "scenario_id": "42",
          },
        ]
      `);
      expect(sdb.getScenarioPrompts.mock.calls.length).toBe(1);
      expect(sdb.getScenarioPrompts.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "42",
        ]
      `);
    });
  });

  describe('/api/cohorts/:id/scenario/:scenario_id (get)', () => {
    const path = '/api/cohorts/1/scenario/42';

    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchSnapshot();
      expect(db.getCohortRunResponses.mock.calls.length).toBe(1);
      expect(db.getCohortRunResponses.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "1",
            "scenario_id": "42",
          },
        ]
      `);
      expect(sdb.getScenarioPrompts.mock.calls.length).toBe(1);
      expect(sdb.getScenarioPrompts.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "42",
        ]
      `);
    });
  });

  describe('/api/cohorts/:id/participant/:participant_id (get)', () => {
    const path = '/api/cohorts/1/participant/99';

    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchSnapshot();
      expect(db.getCohortRunResponses.mock.calls.length).toBe(1);
      expect(db.getCohortRunResponses.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "1",
            "participant_id": "99",
          },
        ]
      `);
      expect(sdb.getScenarioPrompts.mock.calls.length).toBe(1);
      expect(sdb.getScenarioPrompts.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          42,
        ]
      `);
    });
  });

  describe('/api/cohorts/:id/run/:run_id (get)', () => {
    const path = '/api/cohorts/1/run/42';

    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchSnapshot();
      expect(db.linkCohortToRun.mock.calls.length).toBe(1);
      expect(db.linkCohortToRun.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
          42,
        ]
      `);
      expect(db.getCohort.mock.calls.length).toBe(1);
      expect(db.getCohort.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
        ]
      `);
    });
  });

  describe('/api/cohorts/:id/join/:role (get)', () => {
    const path = '/api/cohorts/1/join/participant';

    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchSnapshot();
      expect(db.linkUserToCohort.mock.calls.length).toBe(1);
      expect(db.linkUserToCohort.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
          999,
          "participant",
          "join",
        ]
      `);
    });
  });

  describe('/api/cohorts/:id/quit (get)', () => {
    const path = '/api/cohorts/1/quit';

    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchSnapshot();
      expect(db.linkUserToCohort.mock.calls.length).toBe(1);
      expect(db.linkUserToCohort.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
          999,
          undefined,
          "quit",
        ]
      `);
    });
  });

  describe('/api/cohorts/:id/done (get)', () => {
    const path = '/api/cohorts/1/done';

    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchSnapshot();
      expect(db.linkUserToCohort.mock.calls.length).toBe(1);
      expect(db.linkUserToCohort.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
          999,
          undefined,
          "done",
        ]
      `);
    });
  });
});
