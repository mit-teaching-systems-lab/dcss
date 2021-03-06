import assert from 'assert';
import {
  createMockConnectedStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/logs';
import * as types from '../../actions/types';

const original = JSON.parse(JSON.stringify(state));
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  store = createMockConnectedStore({});
  fetch.mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('GET_LOGS_SUCCESS', () => {
  describe('Default', () => {
    const direction = 'DESC';
    const queryBy = 'date';
    const date = new Date();
    const max = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() - 5);
    const min = date.toISOString().slice(0, 10);

    test('{direction: "DESC", queryBy: "date", min = today - 5 days, max = today}', async () => {
      const logs = state.logs.slice();
      fetchImplementation(fetch, 200, { logs });

      const returnValue = await store.dispatch(actions.getLogs({}));
      const defaultRequestPath = `/api/logs/range/date/${min}/${max}/DESC`;

      expect(fetch.mock.calls[0]).toEqual([defaultRequestPath]);
      expect(store.getState().logsById).toEqual(makeById(logs));
      expect(store.getState().logs).toEqual(logs);
      expect(returnValue).toEqual(logs);
    });
  });

  describe('Date', () => {
    const direction = 'DESC';
    const queryBy = 'date';
    const date = new Date('2020-01-01');
    const max = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() - 5);
    const min = date.toISOString().slice(0, 10);

    test('{direction: "DESC", queryBy: "date", min, max}', async () => {
      const logs = state.logs.slice();
      fetchImplementation(fetch, 200, { logs });

      const returnValue = await store.dispatch(
        actions.getLogs({
          direction,
          queryBy,
          min,
          max
        })
      );

      expect(fetch.mock.calls[0]).toEqual([
        '/api/logs/range/date/2019-12-27/2020-01-01/DESC'
      ]);
      expect(store.getState().logsById).toEqual(makeById(logs));
      expect(store.getState().logs).toEqual(logs);
      expect(returnValue).toEqual(logs);
    });

    test('{direction: "ASC", queryBy: "date", min, max}', async () => {
      const logs = state.logs.slice();
      fetchImplementation(fetch, 200, { logs });

      const returnValue = await store.dispatch(
        actions.getLogs({
          direction: 'ASC',
          queryBy,
          min,
          max
        })
      );

      expect(fetch.mock.calls[0]).toEqual([
        '/api/logs/range/date/2019-12-27/2020-01-01/ASC'
      ]);
      expect(store.getState().logsById).toEqual(makeById(logs));
      expect(store.getState().logs).toEqual(logs);
      expect(returnValue).toEqual(logs);
    });
  });

  describe('Count', () => {
    const direction = 'DESC';
    const queryBy = 'count';
    const max = 10;
    const min = 1;

    test('{direction: "DESC", queryBy: "count", min, max}', async () => {
      const logs = state.logs.slice();
      fetchImplementation(fetch, 200, { logs });

      const returnValue = await store.dispatch(
        actions.getLogs({
          direction,
          queryBy,
          min,
          max
        })
      );

      expect(fetch.mock.calls[0]).toEqual(['/api/logs/range/count/1/10/DESC']);
      expect(store.getState().logsById).toEqual(makeById(logs));
      expect(store.getState().logs).toEqual(logs);
      expect(returnValue).toEqual(logs);
    });

    test('{direction: "ASC", queryBy: "count", min, max}', async () => {
      const logs = state.logs.slice();
      fetchImplementation(fetch, 200, { logs });

      const returnValue = await store.dispatch(
        actions.getLogs({
          direction: 'ASC',
          queryBy,
          min,
          max
        })
      );

      expect(fetch.mock.calls[0]).toEqual(['/api/logs/range/count/1/10/ASC']);
      expect(store.getState().logsById).toEqual(makeById(logs));
      expect(store.getState().logs).toEqual(logs);
      expect(returnValue).toEqual(logs);
    });
  });
});

test('GET_LOGS_ERROR', async () => {
  const error = new Error('something unexpected happened on the server');
  const direction = 'DESC';
  const queryBy = 'count';
  const max = 10;
  const min = 1;
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(
    actions.getLogs({
      direction,
      queryBy,
      min,
      max
    })
  );

  expect(fetch.mock.calls[0]).toEqual(['/api/logs/range/count/1/10/DESC']);
  expect(store.getState().errors.logs.error).toEqual(error);
  expect(returnValue).toBe(null);
});
