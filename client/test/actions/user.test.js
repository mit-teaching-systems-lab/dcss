import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createStore,
  fetchImplementation,
  makeById,
  state,
} from '../bootstrap';

import * as actions from '../../actions/user';
import * as types from '../../actions/types';
import Storage from '../../util/Storage';
jest.mock('../../util/Storage');

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
  Storage.has = jest.fn();
  Storage.delete = jest.fn();
});

afterAll(() => {
  fetch.mockRestore();
  Storage.has.mockRestore();
  Storage.delete.mockRestore();
});

beforeEach(() => {
  store = createStore({});
  fetch.mockImplementation(() => {});
  Storage.has.mockImplementation(() => true);
  Storage.delete.mockImplementation(() => {});
});

afterEach(() => {
  fetch.mockReset();
  Storage.has.mockReset();
  Storage.delete.mockReset();
});

test('SET_USERS_SUCCESS', async () => {
  const user = { ...state.user };

  fetchImplementation(fetch, 200, { user });

  const returnValue = await store.dispatch(actions.setUser({x: 1}));
  assert.deepEqual(store.getState().user, user);
  assert.equal(returnValue, user);

  await store.dispatch(actions.setUser());
});

test('SET_USER_ERROR', async () => {

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.setUser({x:1}));
  assert.deepEqual(fetch.mock.calls[0], [ '/api/auth/me' ]);
  assert.deepEqual(store.getState().errors.user.error, error);
  assert.equal(returnValue, null);
});

test('GET_USERS_SUCCESS', async () => {
  const user = { ...state.user };

  fetchImplementation(fetch, 200, { user });

  const returnValue = await store.dispatch(actions.getUser());

  assert.deepEqual(fetch.mock.calls[0], [ '/api/auth/me' ]);
  assert.deepEqual(store.getState().user, user);
  assert.deepEqual(returnValue, user);
});

test('GET_USER_ERROR', async () => {

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getUser());
  assert.deepEqual(fetch.mock.calls[0], [ '/api/auth/me' ]);
  assert.deepEqual(store.getState().errors.user.error, error);
  assert.equal(returnValue, null);
});

test('GET_SESSION_SUCCESS', async () => {
  const user = { ...state.user };

  fetchImplementation(fetch, 200, { user });

  const returnValue = await store.dispatch(actions.getSession());
  assert.deepEqual(fetch.mock.calls[0], [ '/api/auth/session' ]);
  assert.deepEqual(returnValue, user);
});

test('GET_SESSION_ERROR', async () => {

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getSession());
  assert.deepEqual(fetch.mock.calls[0], [ '/api/auth/session' ]);
  assert.deepEqual(store.getState().errors.session.error, error);
  assert.equal(returnValue, null);
});
