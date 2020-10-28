import assert from 'assert';
import {
  createPseudoRealStore,
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
  store = createPseudoRealStore({});
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

      assert.deepEqual(fetch.mock.calls[0], [defaultRequestPath]);
      assert.deepEqual(store.getState().logsById, makeById(logs));
      assert.deepEqual(store.getState().logs, logs);
      assert.deepEqual(returnValue, logs);
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

      assert.deepEqual(fetch.mock.calls[0], [
        '/api/logs/range/date/2019-12-27/2020-01-01/DESC'
      ]);
      assert.deepEqual(store.getState().logsById, makeById(logs));
      assert.deepEqual(store.getState().logs, logs);
      assert.deepEqual(returnValue, logs);
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

      assert.deepEqual(fetch.mock.calls[0], [
        '/api/logs/range/date/2019-12-27/2020-01-01/ASC'
      ]);
      assert.deepEqual(store.getState().logsById, makeById(logs));
      assert.deepEqual(store.getState().logs, logs);
      assert.deepEqual(returnValue, logs);
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

      assert.deepEqual(fetch.mock.calls[0], [
        '/api/logs/range/count/1/10/DESC'
      ]);
      assert.deepEqual(store.getState().logsById, makeById(logs));
      assert.deepEqual(store.getState().logs, logs);
      assert.deepEqual(returnValue, logs);
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

      assert.deepEqual(fetch.mock.calls[0], ['/api/logs/range/count/1/10/ASC']);
      assert.deepEqual(store.getState().logsById, makeById(logs));
      assert.deepEqual(store.getState().logs, logs);
      assert.deepEqual(returnValue, logs);
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

  assert.deepEqual(fetch.mock.calls[0], ['/api/logs/range/count/1/10/DESC']);
  assert.deepEqual(store.getState().errors.logs.error, error);
  assert.equal(returnValue, null);
});
