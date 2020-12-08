import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/runs/db';
import * as ep from '../../service/runs/endpoints';

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

const runWithoutCohortId = {
  id: 60,
  run_id: 60,
  scenario_id: 42,
  cohort_id: null,
  user_id: 999,
  created_at: '2020-09-01T15:59:39.571Z',
  updated_at: '2020-09-01T15:59:47.121Z',
  ended_at: null,
  consent_id: 57,
  consent_acknowledged_by_user: true,
  consent_granted_by_user: true,
  referrer_params: null
};

const runWithCohortId = {
  id: 61,
  run_id: 61,
  scenario_id: 42,
  cohort_id: 2,
  user_id: 999,
  created_at: '2020-09-01T15:59:39.571Z',
  updated_at: '2020-09-01T15:59:47.121Z',
  ended_at: null,
  consent_id: 57,
  consent_acknowledged_by_user: true,
  consent_granted_by_user: true,
  referrer_params: null
};

const runs = [runWithoutCohortId, runWithCohortId];

const runsById = runs.reduce((accum, run) => {
  accum[run.id] = run;
  return accum;
}, {});

const runEvent = {
  name: 'NAME',
  context: {}
};

jest.mock('../../service/runs/db', () => {
  return {
    ...jest.requireActual('../../service/runs/db'),
    getRunById: jest.fn(),
    getRunByIdentifiers: jest.fn(),
    getRuns: jest.fn(),
    createRun: jest.fn(),
    updateRun: jest.fn(),
    saveRunEvent: jest.fn(),
    updateResponse: jest.fn(),
    getResponse: jest.fn(),
    getLastResponseOrderedById: jest.fn(),
    upsertResponse: jest.fn(),
    getRunResponses: jest.fn(),
    getResponses: jest.fn(),
    getResponseTranscript: jest.fn(),
    getTranscriptionOutcome: jest.fn(),
    finishRun: jest.fn()
  };
});

import * as runsmw from '../../service/runs/middleware';
jest.mock('../../service/runs/middleware', () => {
  // const runsmw = jest.requireActual('../../service/runs/middleware');
  return {
    // ...runsmw,
    runForRequest: jest.fn(),
    requireUserForRun: jest.fn()
  };
});

import * as scenariosdb from '../../service/scenarios/db';
jest.mock('../../service/scenarios/db', () => {
  const scenariosdb = jest.requireActual('../../service/scenarios/db');
  return {
    ...scenariosdb,
    getScenarioConsent: jest.fn(),
    getScenarioPrompts: jest.fn()
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

import * as rolesmw from '../../service/roles/middleware';
jest.mock('../../service/roles/middleware', () => {
  const rolesmw = jest.requireActual('../../service/roles/middleware');
  return {
    ...rolesmw,
    requireUserRole: jest.fn(() => [])
  };
});

describe('/api/runs/*', () => {
  let notification = null;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    runsmw.runForRequest.mockImplementation(() => {
      return { id: 9 };
    });

    runsmw.requireUserForRun.mockImplementation((req, res, next) => next());

    authmw.requireUser.mockImplementation((req, res, next) => {
      req.session.user = user;
      next();
    });

    rolesmw.requireUserRole.mockImplementation(() => [
      (req, res, next) => next()
    ]);

    db.saveRunEvent.mockImplementation(async props => {
      return {
        ...runEvent
      };
    });

    db.createRun.mockImplementation(
      async (user_id, scenario_id, consent_id) => {
        return {
          ...runWithoutCohortId,
          user_id,
          scenario_id,
          consent_id,
          consent_acknowledged_by_user: false,
          consent_granted_by_user: false
        };
      }
    );

    scenariosdb.getScenarioConsent.mockImplementation(async () => {
      return { id: 1 };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // ? `/api/runs/new-or-existing/scenario/${scenario_id}/cohort/${cohort_id}`
  // : `/api/runs/new-or-existing/scenario/${scenario_id}`;

  describe('/api/runs/new-or-existing/*', () => {
    describe('/api/runs/new-or-existing/scenario/:scenario_id', () => {
      const path = '/api/runs/new-or-existing/scenario/42';

      test('get existing success', async () => {
        db.getRunByIdentifiers.mockImplementation(() => {
          return runWithoutCohortId;
        });

        const response = await request({ path });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "run": Object {
              "cohort_id": null,
              "consent_acknowledged_by_user": true,
              "consent_granted_by_user": true,
              "consent_id": 57,
              "created_at": "2020-09-01T15:59:39.571Z",
              "ended_at": null,
              "id": 60,
              "referrer_params": null,
              "run_id": 60,
              "scenario_id": 42,
              "updated_at": "2020-09-01T15:59:47.121Z",
              "user_id": 999,
            },
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            Object {
              "scenario_id": 42,
            },
          ]
        `);
      });

      test('get existing failure', async () => {
        db.getRunByIdentifiers.mockImplementation(() => {
          throw error;
        });

        const response = await request({ path, status: 500 });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": Object {},
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            Object {
              "scenario_id": 42,
            },
          ]
        `);
      });

      test('get new success', async () => {
        db.getRunByIdentifiers.mockImplementation(() => {
          return undefined;
        });

        const response = await request({ path });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "run": Object {
              "cohort_id": null,
              "consent_acknowledged_by_user": false,
              "consent_granted_by_user": false,
              "consent_id": 1,
              "created_at": "2020-09-01T15:59:39.571Z",
              "ended_at": null,
              "id": 60,
              "referrer_params": null,
              "run_id": 60,
              "scenario_id": 42,
              "updated_at": "2020-09-01T15:59:47.121Z",
              "user_id": 999,
            },
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            Object {
              "scenario_id": 42,
            },
          ]
        `);
        expect(scenariosdb.getScenarioConsent.mock.calls.length).toBe(1);
        expect(scenariosdb.getScenarioConsent.mock.calls[0])
          .toMatchInlineSnapshot(`
          Array [
            42,
          ]
        `);
        expect(db.createRun.mock.calls.length).toBe(1);
        expect(db.createRun.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            42,
            1,
          ]
        `);
      });

      test('get new failure (getScenarioConsent)', async () => {
        db.getRunByIdentifiers.mockImplementation(() => {
          return undefined;
        });

        scenariosdb.getScenarioConsent.mockImplementation(() => {
          throw error;
        });

        const response = await request({ path, status: 500 });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": Object {},
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            Object {
              "scenario_id": 42,
            },
          ]
        `);
        expect(scenariosdb.getScenarioConsent.mock.calls.length).toBe(1);
        expect(scenariosdb.getScenarioConsent.mock.calls[0])
          .toMatchInlineSnapshot(`
          Array [
            42,
          ]
        `);
        expect(db.createRun.mock.calls.length).toBe(0);
      });

      test('get new failure (createRun)', async () => {
        db.getRunByIdentifiers.mockImplementation(() => {
          return undefined;
        });

        db.createRun.mockImplementation(() => {
          throw error;
        });

        const response = await request({ path, status: 500 });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": Object {},
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            Object {
              "scenario_id": 42,
            },
          ]
        `);
        expect(scenariosdb.getScenarioConsent.mock.calls.length).toBe(1);
        expect(scenariosdb.getScenarioConsent.mock.calls[0])
          .toMatchInlineSnapshot(`
          Array [
            42,
          ]
        `);
        expect(db.createRun.mock.calls.length).toBe(1);
        expect(db.createRun.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            42,
            1,
          ]
        `);
      });
    });

    describe('/api/runs/new-or-existing/scenario/:scenario_id/cohort/:cohort_id', () => {
      const path = '/api/runs/new-or-existing/scenario/42/cohort/2';

      test('get existing success', async () => {
        db.getRunByIdentifiers.mockImplementation(() => {
          return runWithCohortId;
        });

        const response = await request({ path });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "run": Object {
              "cohort_id": 2,
              "consent_acknowledged_by_user": true,
              "consent_granted_by_user": true,
              "consent_id": 57,
              "created_at": "2020-09-01T15:59:39.571Z",
              "ended_at": null,
              "id": 61,
              "referrer_params": null,
              "run_id": 61,
              "scenario_id": 42,
              "updated_at": "2020-09-01T15:59:47.121Z",
              "user_id": 999,
            },
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            Object {
              "cohort_id": 2,
              "scenario_id": 42,
            },
          ]
        `);
      });

      test('get existing failure', async () => {
        db.getRunByIdentifiers.mockImplementation(() => {
          throw error;
        });

        const response = await request({ path, status: 500 });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": Object {},
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            Object {
              "cohort_id": 2,
              "scenario_id": 42,
            },
          ]
        `);
      });

      test('get new success', async () => {
        db.getRunByIdentifiers.mockImplementation(() => {
          return undefined;
        });

        const response = await request({ path });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "run": Object {
              "cohort_id": null,
              "consent_acknowledged_by_user": false,
              "consent_granted_by_user": false,
              "consent_id": 1,
              "created_at": "2020-09-01T15:59:39.571Z",
              "ended_at": null,
              "id": 60,
              "referrer_params": null,
              "run_id": 60,
              "scenario_id": 42,
              "updated_at": "2020-09-01T15:59:47.121Z",
              "user_id": 999,
            },
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            Object {
              "cohort_id": 2,
              "scenario_id": 42,
            },
          ]
        `);
      });

      test('get new failure (getScenarioConsent)', async () => {
        db.getRunByIdentifiers.mockImplementation(() => {
          return undefined;
        });

        scenariosdb.getScenarioConsent.mockImplementation(() => {
          throw error;
        });

        const response = await request({ path, status: 500 });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": Object {},
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            Object {
              "cohort_id": 2,
              "scenario_id": 42,
            },
          ]
        `);
        expect(scenariosdb.getScenarioConsent.mock.calls.length).toBe(1);
        expect(scenariosdb.getScenarioConsent.mock.calls[0])
          .toMatchInlineSnapshot(`
          Array [
            42,
          ]
        `);
        expect(db.createRun.mock.calls.length).toBe(0);
      });

      test('get new failure (createRun)', async () => {
        db.getRunByIdentifiers.mockImplementation(() => {
          return undefined;
        });

        db.createRun.mockImplementation(() => {
          throw error;
        });

        const response = await request({ path, status: 500 });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": Object {},
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls.length).toBe(1);
        expect(db.getRunByIdentifiers.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            Object {
              "cohort_id": 2,
              "scenario_id": 42,
            },
          ]
        `);
        expect(scenariosdb.getScenarioConsent.mock.calls.length).toBe(1);
        expect(scenariosdb.getScenarioConsent.mock.calls[0])
          .toMatchInlineSnapshot(`
          Array [
            42,
          ]
        `);
        expect(db.createRun.mock.calls.length).toBe(1);
        expect(db.createRun.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            999,
            42,
            1,
          ]
        `);
      });
    });
  });

  describe('/api/runs/:run_id/event/:name', () => {
    const path = '/api/runs/9/event/NAME';
    const method = 'post';

    test('post success', async () => {
      const body = {
        ...runEvent
      };

      const response = await request({ path, method, body, status: 201 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "event": Object {
            "context": Object {},
            "name": "NAME",
          },
        }
      `);
      expect(runsmw.runForRequest.mock.calls.length).toBe(1);
      expect(db.saveRunEvent.mock.calls.length).toBe(1);
      expect(db.saveRunEvent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          9,
          "NAME",
          Object {},
        ]
      `);
    });
  });
});
