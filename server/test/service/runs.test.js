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

const runEvent = {
  name: 'NAME',
  context: {}
};

jest.mock('../../service/runs/db', () => {
  return {
    ...jest.requireActual('../../service/runs/db'),
    getRunById: jest.fn(),
    getRuns: jest.fn(),
    getRunByScenarioAndUserId: jest.fn(),
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

import * as runmw from '../../service/runs/middleware';
jest.mock('../../service/runs/middleware', () => {
  // const runmw = jest.requireActual('../../service/runs/middleware');
  return {
    // ...runmw,
    runForRequest: jest.fn(),
    requireUserForRun: jest.fn()
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
    runmw.runForRequest.mockImplementation(() => {
      return { id: 9 };
    });

    runmw.requireUserForRun.mockImplementation((req, res, next) => next());

    amw.requireUser.mockImplementation((req, res, next) => {
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
  });

  afterEach(() => {
    jest.resetAllMocks();
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
      expect(runmw.runForRequest.mock.calls.length).toBe(1);
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
