import assert from 'assert';
import {
  createMockConnectedStore,
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
  store = createMockConnectedStore({});
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
  expect(store.getState().session).toEqual({
    isLoggedIn: true,
    ...session
  });
});

test('LOG_OUT', async () => {
  const session = {
    permissions: ['a', 'b', 'c']
  };

  await store.dispatch(actions.setSession(session));
  expect(store.getState().session).toEqual({
    isLoggedIn: true,
    ...session
  });
  await store.dispatch(actions.logOut());
  expect(Storage.clear.mock.calls.length).toBe(1);
  expect(fetch.mock.calls.length).toBe(1);
  expect(store.getState().session).toEqual({
    isLoggedIn: false,
    permissions: []
  });
  expect(store.getState().user).toEqual({
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
  expect(fetch.mock.calls[0]).toEqual(['/api/auth/session']);
  expect(returnValue).toEqual(user);
});

test('GET_SESSION_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getSession());
  expect(fetch.mock.calls[0]).toEqual(['/api/auth/session']);
  expect(store.getState().errors.session.error).toEqual(error);
  expect(returnValue).toBe(null);
});

test('GET_PERMISSIONS_SUCCESS', async () => {
  const permissions = ['x', 'y'];

  fetchImplementation(fetch, 200, { permissions });

  const returnValue = await store.dispatch(actions.getPermissions());
  expect(fetch.mock.calls[0]).toEqual(['/api/roles/permission']);
  expect(returnValue).toEqual(permissions);
});

test('GET_PERMISSIONS_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getPermissions());
  expect(fetch.mock.calls[0]).toEqual(['/api/roles/permission']);
  expect(store.getState().errors.permission.error).toEqual(error);
  expect(returnValue).toBe(null);
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
  expect(fetch.mock.calls[0]).toEqual([
    '/api/auth/login',
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: '{"username":"foobar","password":"X"}'
    }
  ]);
  expect(returnValue).toEqual({ error, message });
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
  expect(fetch.mock.calls[0]).toEqual([
    '/api/auth/login',
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: '{"username":"foobar","password":"X"}'
    }
  ]);
  expect(returnValue).toEqual({ error, message });
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
  expect(fetch.mock.calls.length).toEqual(0);
  expect(returnValue).toEqual({
    error,
    message: 'Something happened during log in'
  });
});
