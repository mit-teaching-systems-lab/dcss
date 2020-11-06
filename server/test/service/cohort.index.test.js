import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/cohort/db';
import * as ep from '../../service/cohort/endpoints';

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
    {
      id: 999,
      email: 'super@email.com',
      username: 'superuser',
      roles: ['owner', 'facilitator', 'participant'],
      is_anonymous: false,
      is_owner: true
    }
  ],
  usersById: {
    '999': {
      id: 999,
      email: 'super@email.com',
      username: 'superuser',
      roles: ['owner', 'facilitator', 'participant'],
      is_anonymous: false,
      is_owner: true
    },
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

jest.mock('../../service/cohort/db', () => {
  return {
    ...jest.requireActual('../../service/cohort/db'),
    createCohort: jest.fn(),
    getCohort: jest.fn(),
    getMyCohorts: jest.fn(),
    getAllCohorts: jest.fn(),
    setCohort: jest.fn(),
    setCohortScenarios: jest.fn(),
    getCohortRunResponses: jest.fn(),
    linkCohortToRun: jest.fn(),
    getCohortUserRoles: jest.fn(),
    linkUserToCohort: jest.fn(),
    addCohortUserRole: jest.fn(),
    deleteCohortUserRole: jest.fn(),
    listUserCohorts: jest.fn()
  };
});

import * as cohortmw from '../../service/cohort/middleware';
jest.mock('../../service/cohort/middleware', () => {
  const cohortmw = jest.requireActual('../../service/cohort/middleware');
  return {
    ...cohortmw,
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

describe('/api/cohort/*', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    adb.getUserById.mockImplementation(async () => user);
    amw.requireUser.mockImplementation((req, res, next) => {
      req.session.user = user;
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
    db.getAllCohorts.mockImplementation(async () => [cohort]);
    db.getCohortRunResponses.mockImplementation(async () => [
      { response_id: 1, scenario_id: 42 }
    ]);
    db.getMyCohorts.mockImplementation(async () => [cohort]);
    db.listUserCohorts.mockImplementation(async () => [cohort]);
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
    cohortmw.requireCohortUserRole.mockImplementation(() => [
      (req, res, next) => next()
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/cohort/ (put)', () => {
    const path = '/api/cohort/';
    const method = 'put';
    const body = { name: 'A New Cohort' };

    beforeEach(() => {});

    test('success', async () => {
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
  });

  describe('/api/cohort/:id (get)', () => {
    const path = '/api/cohort/1';

    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchSnapshot();
      expect(db.getCohort.mock.calls.length).toBe(1);
      expect(db.getCohort.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
        ]
      `);
    });
  });

  describe('/api/cohort/:id (post)', () => {
    const path = '/api/cohort/1';
    const method = 'post';

    beforeEach(() => {
      rolesmw.requireUserRole.mockImplementation(() => [
        (req, res, next) => {
          next();
        }
      ]);
    });
    describe('success', () => {
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
  });

  describe('/api/cohort/:id/scenarios', () => {
    const path = '/api/cohort/1/scenarios';
    const method = 'post';

    test('success', async () => {
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

  describe('/api/cohort/my (get)', () => {
    const path = '/api/cohort/my';

    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchSnapshot();
      expect(db.getMyCohorts.mock.calls.length).toBe(1);
      expect(db.getMyCohorts.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
        ]
      `);
    });
  });

  describe('/api/cohort/all (get)', () => {
    const path = '/api/cohort/all';

    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchSnapshot();
      expect(db.getAllCohorts.mock.calls.length).toBe(1);
      expect(db.getAllCohorts.mock.calls[0]).toMatchSnapshot(`Array []`);
    });
  });

  describe('/api/cohort/:id/scenario/:scenario_id/:user_id (get)', () => {
    const path = '/api/cohort/1/scenario/42/999';

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

  describe('/api/cohort/:id/scenario/:scenario_id (get)', () => {
    const path = '/api/cohort/1/scenario/42';

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

  describe('/api/cohort/:id/participant/:participant_id (get)', () => {
    const path = '/api/cohort/1/participant/99';

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

  describe('/api/cohort/:id/run/:run_id (get)', () => {
    const path = '/api/cohort/1/run/42';

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

  describe('/api/cohort/:id/join/:role (get)', () => {
    const path = '/api/cohort/1/join/participant';

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

  describe('/api/cohort/:id/quit (get)', () => {
    const path = '/api/cohort/1/quit';

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

  describe('/api/cohort/:id/done (get)', () => {
    const path = '/api/cohort/1/done';

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
