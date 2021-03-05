import { v4 as uuid } from 'uuid';
import {
  createMockStore,
  createMockConnectedStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/run';
import * as types from '../../actions/types';
import Storage from '../../util/Storage';
jest.mock('../../util/Storage');

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));
let mockStore;
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
  Storage.has = jest.fn();
  Storage.delete = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
  Storage.has.mockRestore();
  Storage.delete.mockRestore();
});

beforeEach(() => {
  mockStore = createMockStore({});
  store = createMockConnectedStore({});
  fetch.mockImplementation(() => {});
  Storage.has.mockImplementation(() => true);
  Storage.delete.mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
  Storage.has.mockReset();
  Storage.delete.mockReset();
});

describe('GET_RUN_SUCCESS', () => {
  const run = { ...state.run };

  describe('getRun', () => {
    test('by scenario id', async () => {
      fetchImplementation(fetch, 200, { run });

      const returnValue = await store.dispatch(actions.getRun(1));
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/runs/new-or-existing/scenario/1",
        ]
      `);
      expect(store.getState().runsById).toEqual(makeById([run]));
      expect(store.getState().run).toEqual(run);
      expect(returnValue).toEqual(run);

      await mockStore.dispatch(actions.getRun(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "run": Object {
              "consent_acknowledged_by_user": true,
              "consent_granted_by_user": true,
              "consent_id": 57,
              "created_at": "2020-09-01T15:59:39.571Z",
              "ended_at": null,
              "id": 60,
              "referrer_params": null,
              "scenario_id": 42,
              "updated_at": "2020-09-01T15:59:47.121Z",
              "user_id": 2,
            },
            "type": "GET_RUN_SUCCESS",
          },
        ]
      `);
    });

    test('by scenario id, by cohort id', async () => {
      fetchImplementation(fetch, 200, { run });

      const returnValue = await store.dispatch(actions.getRun(1, 2));
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/runs/new-or-existing/scenario/1/cohort/2",
        ]
      `);
      expect(store.getState().runsById).toEqual(makeById([run]));
      expect(store.getState().run).toEqual(run);
      expect(returnValue).toEqual(run);

      await mockStore.dispatch(actions.getRun(1, 2));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "run": Object {
              "consent_acknowledged_by_user": true,
              "consent_granted_by_user": true,
              "consent_id": 57,
              "created_at": "2020-09-01T15:59:39.571Z",
              "ended_at": null,
              "id": 60,
              "referrer_params": null,
              "scenario_id": 42,
              "updated_at": "2020-09-01T15:59:47.121Z",
              "user_id": 2,
            },
            "type": "GET_RUN_SUCCESS",
          },
        ]
      `);
    });
  });

  describe('getRunByIdentifiers', () => {
    test('by scenario id, cohort id, chat id', async () => {
      fetchImplementation(fetch, 200, { run });

      const returnValue = await store.dispatch(
        actions.getRunByIdentifiers(1, 2, 3)
      );
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/runs/by-identifiers/scenario/1/cohort/2/chat/3",
        ]
      `);
      expect(store.getState().runsById).toEqual(makeById([run]));
      expect(store.getState().run).toEqual(run);
      expect(returnValue).toEqual(run);

      await mockStore.dispatch(actions.getRunByIdentifiers(1, 2, 3));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "run": Object {
              "consent_acknowledged_by_user": true,
              "consent_granted_by_user": true,
              "consent_id": 57,
              "created_at": "2020-09-01T15:59:39.571Z",
              "ended_at": null,
              "id": 60,
              "referrer_params": null,
              "scenario_id": 42,
              "updated_at": "2020-09-01T15:59:47.121Z",
              "user_id": 2,
            },
            "type": "GET_RUN_SUCCESS",
          },
        ]
      `);
    });
  });
});

describe('GET_RUN_ERROR', () => {
  test('getRun', async () => {
    fetchImplementation(fetch, 200, { error });
    const returnValue = await store.dispatch(actions.getRun(1));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/runs/new-or-existing/scenario/1",
      ]
    `);
    expect(store.getState().errors.run.error).toEqual(error);
    expect(returnValue).toBe(null);
  });
  test('getRunByIdentifiers', async () => {
    fetchImplementation(fetch, 200, { error });
    const returnValue = await store.dispatch(
      actions.getRunByIdentifiers(1, 2, 3)
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/runs/by-identifiers/scenario/1/cohort/2/chat/3",
      ]
    `);
    expect(store.getState().errors.run.error).toEqual(error);
    expect(returnValue).toBe(null);
  });
});

test('SET_RUN_SUCCESS', async () => {
  const data = {};
  const run = { ...state.run };

  fetchImplementation(fetch, 200, { run });

  const returnValue = await store.dispatch(actions.setRun(1, data));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/runs/1",
      Object {
        "body": "{}",
        "headers": Object {
          "Content-Type": "application/json",
        },
        "method": "PUT",
      },
    ]
  `);
  expect(store.getState().runsById).toEqual(makeById([run]));
  expect(store.getState().run).toEqual(run);
  expect(returnValue).toEqual(run);
});

test('SET_RUN_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.setRun(1, {}));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/runs/1",
      Object {
        "body": "{}",
        "headers": Object {
          "Content-Type": "application/json",
        },
        "method": "PUT",
      },
    ]
  `);
  expect(store.getState().errors.run.error).toEqual(error);
  expect(returnValue).toBe(null);
});

test('GET_RUNS_SUCCESS', async () => {
  const runs = [{ ...state.run }];

  fetchImplementation(fetch, 200, { runs });

  const returnValue = await store.dispatch(actions.getRuns());
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/runs",
    ]
  `);
  expect(store.getState().runsById).toEqual(makeById(runs));
  expect(returnValue).toEqual(runs);
});

test('GET_RUNS_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getRuns());
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/runs",
    ]
  `);
  expect(store.getState().errors.runs.error).toEqual(error);
  expect(returnValue).toBe(null);
});

test('SAVE_RUN_EVENT_SUCCESS', async () => {
  const rundata = { prompts: [], responses: [] };
  fetchImplementation(fetch, 200, { ...rundata });

  const returnValue = await store.dispatch(actions.getRunData(1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/runs/1",
    ]
  `);
  expect(returnValue).toEqual(rundata);
});

test('GET_RUN_DATA_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getRunData(1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/runs/1",
    ]
  `);
  expect(store.getState().errors.rundata.error).toEqual(error);
  expect(returnValue).toBe(null);
});

test('SAVE_RUN_EVENT_SUCCESS', async () => {
  Date.now = jest.fn(() => 'TIMESTAMP');
  const event = {};
  fetchImplementation(fetch, 200, { event });

  const returnValue = await store.dispatch(actions.saveRunEvent(1, 'NAME', {}));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/runs/1/event/NAME",
      Object {
        "body": "{\\"name\\":\\"NAME\\",\\"context\\":{\\"timestamp\\":\\"TIMESTAMP\\",\\"url\\":\\"http://localhost/\\"}}",
        "headers": Object {
          "Content-Type": "application/json",
        },
        "method": "POST",
      },
    ]
  `);
  expect(returnValue).toEqual(event);
});

test('SAVE_RUN_EVENT_ERROR', async () => {
  Date.now = jest.fn(() => 'TIMESTAMP');
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.saveRunEvent(1, 'NAME', {}));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/runs/1/event/NAME",
      Object {
        "body": "{\\"name\\":\\"NAME\\",\\"context\\":{\\"timestamp\\":\\"TIMESTAMP\\",\\"url\\":\\"http://localhost/\\"}}",
        "headers": Object {
          "Content-Type": "application/json",
        },
        "method": "POST",
      },
    ]
  `);
  expect(store.getState().errors.event.error).toEqual(error);
  expect(returnValue).toBe(null);
});
