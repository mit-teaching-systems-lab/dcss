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
