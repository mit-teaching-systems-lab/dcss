import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/cohorts/db';
import * as ep from '../../service/cohorts/endpoints';

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

import * as cohortmw from '../../service/cohorts/middleware';
jest.mock('../../service/cohorts/middleware', () => {
  const cohortmw = jest.requireActual('../../service/cohorts/middleware');
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

describe('/api/cohorts/*', () => {
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
    cohortmw.requireCohortUserRole.mockImplementation(() => [
      (req, res, next) => next()
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/cohorts/:id/roles/add (post)', () => {
    const path = '/api/cohorts/1/roles/add';
    const method = 'post';
    const body = {
      cohort_id: 1,
      user_id: 99,
      roles: ['x']
    };

    test('success', async () => {
      const response = await request({ path, method, body });
      expect(await response.json()).toMatchSnapshot();
      expect(db.addCohortUserRole.mock.calls.length).toBe(1);
      expect(db.addCohortUserRole.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
          99,
          Array [
            "x",
          ],
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

  // TODO: Investigate timeout
  // describe('/api/cohorts/:id/roles/delete (post)', () => {
  //   const path = '/api/cohorts/1/roles/delete';
  //   const method = 'post';
  //   const body = {
  //     cohort_id: 1,
  //     user_id: 99,
  //     roles: ['x']
  //   };

  //   test('success', async () => {
  //     const response = await request({ path, method, body });
  //     expect(await response.json()).toMatchSnapshot();
  //     expect(db.deleteCohortUserRole.mock.calls.length).toBe(1);
  //     expect(db.deleteCohortUserRole.mock.calls[0]).toMatchInlineSnapshot(`
  //       Array [
  //         1,
  //         42,
  //       ]
  //     `);
  //     expect(db.getCohort.mock.calls.length).toBe(1);
  //     expect(db.getCohort.mock.calls[0]).toMatchInlineSnapshot(`
  //       Array [
  //         1,
  //         42,
  //       ]
  //     `);
  //   });
  // });
});
