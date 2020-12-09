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
    state = [...original.logs.slice(0, 1)];
    logs = [...original.logs];
    logsById = {
      ...original.logsById
    };
  });

  test('initial state', () => {
    expect(reducer.logs(undefined, {})).toEqual(initialState);
    expect(reducer.logs(undefined, {})).toEqual(initialState);
    expect(reducer.logsById(undefined, {})).toEqual(initialStateById);
    expect(reducer.logsById(undefined, {})).toEqual(initialStateById);
  });

  test('GET_LOGS_SUCCESS', () => {
    const action = {
      type: types.GET_LOGS_SUCCESS,
      logs
    };
    expect(reducer.logs(undefined, action)).toEqual(logs);
    expect(reducer.logs(undefined, action)).toEqual(logs);
    expect(reducer.logsById(undefined, action)).toEqual(logsById);
    expect(reducer.logsById(undefined, action)).toEqual(logsById);
  });

  test('GET_LOGS_SUCCESS', () => {
    const action = {
      type: types.GET_LOGS_SUCCESS,
      logs
    };
    expect(reducer.logs(state, action)).toEqual(logs);
    expect(reducer.logs(state, action)).toEqual(logs);
  });

  test('GET_LOGS_SUCCESS', () => {
    const action = {
      type: types.GET_LOGS_SUCCESS,
      logs
    };
    state = {
      ...original.logsById
    };
    expect(reducer.logsById(state, action)).toEqual(logsById);
    expect(reducer.logsById(state, action)).toEqual(logsById);
  });
});
