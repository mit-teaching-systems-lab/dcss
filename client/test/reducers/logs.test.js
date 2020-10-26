import assert from 'assert';
import { state } from '../bootstrap';

import * as reducer from '../../reducers/logs';
import * as types from '../../actions/types';

const initialState = [];
const initialStateById = {};
const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('logs', () => {
  let state;
  let logs;
  let logsById;

  beforeEach(() => {
    state = [
      ...original.logs.slice(0, 1)
    ];
    logs = [
      ...original.logs
    ];
    logsById = {
      ...original.logsById
    };
  });

  test('initial state', () => {
    assert.deepEqual(reducer.logs(undefined, {}), initialState);
    assert.deepEqual(reducer.logs(undefined, {}), initialState);
    assert.deepEqual(reducer.logsById(undefined, {}), initialStateById);
    assert.deepEqual(reducer.logsById(undefined, {}), initialStateById);
  });

  test('GET_LOGS_SUCCESS', () => {
    const action = {
      type: types.GET_LOGS_SUCCESS,
      logs
    };
    assert.deepEqual(reducer.logs(undefined, action), logs);
    assert.deepEqual(reducer.logs(undefined, action), logs);
    assert.deepEqual(reducer.logsById(undefined, action), logsById);
    assert.deepEqual(reducer.logsById(undefined, action), logsById);
  });

  test('GET_LOGS_SUCCESS', () => {
    const action = {
      type: types.GET_LOGS_SUCCESS,
      logs
    };
    assert.deepEqual(reducer.logs(state, action), logs);
    assert.deepEqual(reducer.logs(state, action), logs);
  });

  test('GET_LOGS_SUCCESS', () => {
    const action = {
      type: types.GET_LOGS_SUCCESS,
      logs
    };
    state = {
      ...original.logsById
    };
    assert.deepEqual(reducer.logsById(state, action), logsById);
    assert.deepEqual(reducer.logsById(state, action), logsById);
  });
});
