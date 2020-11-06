import assert from 'assert';
import {
  createPseudoRealStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/session';
import * as types from '../../actions/types';
import Storage from '../../util/Storage';
jest.mock('../../util/Storage');

import Crypto from 'crypto-js';
jest.mock('crypto-js', () => {
  //  Crypto.AES.encrypt(password, SESSION_SECRET).toString();
  return {
    AES: {
      encrypt() {
        return {
          toString() {
            return 'X';
          }
        };
      }
    }
  };
});

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
  Storage.clear = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  store = createPseudoRealStore({});
  fetch.mockImplementation(() => {});
  Storage.clear.mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
  delete globalThis.SESSION_SECRET;
});

test('SET_SESSION_SUCCESS', async () => {
  const session = {
    permissions: ['a', 'b', 'c']
  };

  await store.dispatch(actions.setSession(session));
  assert.deepEqual(store.getState().session, {
    isLoggedIn: true,
    ...session
  });
});

test('LOG_OUT', async () => {
  const session = {
    permissions: ['a', 'b', 'c']
  };

  await store.dispatch(actions.setSession(session));
  assert.deepEqual(store.getState().session, {
    isLoggedIn: true,
    ...session
  });
  await store.dispatch(actions.logOut());
  assert.equal(Storage.clear.mock.calls.length, 1);
  assert.equal(fetch.mock.calls.length, 1);
  assert.deepEqual(store.getState().session, {
    isLoggedIn: false,
    permissions: []
  });
  assert.deepEqual(store.getState().user, {
    username: null,
    personalname: null,
    email: null,
    id: null,
    roles: []
  });
});

test('LOG_OUT error', async () => {
  class LogOutError extends Error {}

  Storage.clear = jest.fn();
  Storage.clear.mockImplementation(() => {
    throw new LogOutError();
  });
  await store.dispatch(actions.logOut());
});

test('GET_SESSION_SUCCESS', async () => {
  const user = { ...state.user };

  fetchImplementation(fetch, 200, { user });

  const returnValue = await store.dispatch(actions.getSession());
  assert.deepEqual(fetch.mock.calls[0], ['/api/auth/session']);
  assert.deepEqual(returnValue, user);
});

test('GET_SESSION_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getSession());
  assert.deepEqual(fetch.mock.calls[0], ['/api/auth/session']);
  assert.deepEqual(store.getState().errors.session.error, error);
  assert.equal(returnValue, null);
});

test('GET_PERMISSIONS_SUCCESS', async () => {
  const permissions = ['x', 'y'];

  fetchImplementation(fetch, 200, { permissions });

  const returnValue = await store.dispatch(actions.getPermissions());
  assert.deepEqual(fetch.mock.calls[0], ['/api/roles/permission']);
  assert.deepEqual(returnValue, permissions);
});

test('GET_PERMISSIONS_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getPermissions());
  assert.deepEqual(fetch.mock.calls[0], ['/api/roles/permission']);
  assert.deepEqual(store.getState().errors.permission.error, error);
  assert.equal(returnValue, null);
});

test('LOG_IN', async () => {
  const error = false;
  const message = '';
  const username = 'foobar';
  const password = 'foobar';
  fetchImplementation(fetch, 200, { error, message });

  globalThis.SESSION_SECRET = '';
  const returnValue = await store.dispatch(
    actions.logIn({ username, password })
  );
  assert.deepEqual(fetch.mock.calls[0], [
    '/api/auth/login',
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: '{"username":"foobar","password":"X"}'
    }
  ]);
  assert.deepEqual(returnValue, { error, message });
});

test('LOG_IN error', async () => {
  const message = 'whatever';
  const username = 'foobar';
  const password = 'foobar';
  fetchImplementation(fetch, 200, { error, message });

  globalThis.SESSION_SECRET = '';
  const returnValue = await store.dispatch(
    actions.logIn({ username, password })
  );
  assert.deepEqual(fetch.mock.calls[0], [
    '/api/auth/login',
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: '{"username":"foobar","password":"X"}'
    }
  ]);
  assert.deepEqual(returnValue, { error, message });
});

test('LOG_IN error, 2', async () => {
  class LogInError extends Error {}
  const username = 'foobar';
  const password = 'foobar';
  const error = new LogInError('Something happened during log in');

  fetchImplementation(fetch, 200, {});

  Crypto.AES.encrypt = jest.fn();
  Crypto.AES.encrypt.mockImplementation(() => {
    throw error;
  });

  globalThis.SESSION_SECRET = '';
  const returnValue = await store.dispatch(
    actions.logIn({ username, password })
  );
  assert.deepEqual(fetch.mock.calls.length, 0);
  assert.deepEqual(returnValue, {
    error,
    message: 'Something happened during log in'
  });
});
