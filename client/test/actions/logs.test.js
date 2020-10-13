import assert from 'assert';
import {
  state,
  createStore,
  makeById
} from '../bootstrap';

import * as actions from '../../actions/logs';
import * as types from '../../actions/types';
import Storage from '../../util/Storage';

jest.mock('../../util/Storage');

let original = JSON.parse(JSON.stringify(state));
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
  Storage.clear = jest.fn();
});

afterAll(() => {
  fetch.mockRestore();
  Storage.clear.mockRestore();
});

beforeEach(() => {
  store = createStore(original);
  fetch.mockImplementation(() => {});
  Storage.clear.mockImplementation(() => {});
});

afterEach(() => {
  fetch.mockReset();
  Storage.clear.mockReset();
});

describe('GET_LOGS_SUCCESS', () => {

  beforeEach(() => {
    store = createStore({
      logs: [],
      logsById: {}
    });
  });

  test('{direction: "DESC", queryBy: "date", min, max}', async () => {
    const state = store.getState();
    const logs = state.logs;
    fetch.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve({ logs });
        },
      });
    });

    const today = new Date('2020-01-01');
    const max = today.toISOString().slice(0, 10);
    today.setDate(today.getDate() - 5);
    const min = today.toISOString().slice(0, 10);

    const returnValue = await store.dispatch(actions.getLogs({
      direction: 'DESC',
      queryBy: 'date',
      min,
      max,
    }));

    assert.deepEqual(fetch.mock.calls[0], [ '/api/logs/range/date/2019-12-27/2020-01-01/DESC' ]);

    assert.deepEqual(returnValue, logs);
    assert.deepEqual(store.getState().logs, logs);
    assert.deepEqual(store.getState().logsById, makeById(logs));
  });
  test('{direction: "ASC", queryBy: "date", min, max}', async () => {
    const state = store.getState();
    const logs = state.logs;
    fetch.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve({ logs });
        },
      });
    });

    const today = new Date('2020-01-01');
    const max = today.toISOString().slice(0, 10);
    today.setDate(today.getDate() - 5);
    const min = today.toISOString().slice(0, 10);

    const returnValue = await store.dispatch(actions.getLogs({
      direction: 'ASC',
      queryBy: 'date',
      min,
      max,
    }));

    assert.deepEqual(fetch.mock.calls[0], [ '/api/logs/range/date/2019-12-27/2020-01-01/ASC' ]);

    assert.deepEqual(returnValue, logs);
    assert.deepEqual(store.getState().logs, logs);
    assert.deepEqual(store.getState().logsById, makeById(logs));
  });

});

test('GET_LOGS_ERROR', async () => {
  const error = new Error('something unexpected happened on the server');

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ error });
      },
    });
  });

  const returnValue = await store.dispatch(actions.getLogs({
    direction: 'ASC',
    queryBy: 'date',
    min: 1,
    max: 2,
  }));

  assert.deepEqual(fetch.mock.calls[0], [ '/api/logs/range/date/1/2/ASC' ]);

  const { errors: { logs } } = store.getState();

  // The current value of the errors.logs property will
  // be whatever error info the server returned.
  assert.deepEqual(error, logs.error);
  assert.equal(returnValue, null);
});
