import assert from 'assert';
import { state } from '../bootstrap';

import { loginInitialState } from '../../reducers/initial-states';
import reducer from '../../reducers/login';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('login', () => {
  let state;
  let login;
  beforeEach(() => {
    state = {
      isLoggedIn: false,
      username: '',
    };
    login = {
      isLoggedIn: true,
      permissions: [],
      username: 'super',
    };
  });

  test('initial state', () => {
    assert.deepEqual(reducer(undefined, {}), loginInitialState);
    assert.deepEqual(reducer(undefined, {}), loginInitialState);
  });

  test('LOG_IN', () => {
    const action = {
      type: types.LOG_IN,
      login
    };
    assert.deepEqual(reducer(undefined, action), login);
    assert.deepEqual(reducer(undefined, action), login);
  });

  test('LOG_IN', () => {
    const action = {
      type: types.LOG_IN,
      login
    };
    assert.deepEqual(reducer(state, action), login);
    assert.deepEqual(reducer(state, action), login);
  });

  test('LOG_OUT', () => {
    const action = {
      type: types.LOG_OUT,
      login
    };
    assert.deepEqual(reducer(undefined, action), loginInitialState);
    assert.deepEqual(reducer(undefined, action), loginInitialState);
  });

  test('LOG_OUT', () => {
    const action = {
      type: types.LOG_OUT,
      login
    };
    assert.deepEqual(reducer(state, action), loginInitialState);
    assert.deepEqual(reducer(state, action), loginInitialState);
  });
});
