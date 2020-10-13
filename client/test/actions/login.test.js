import assert from 'assert';
import {
  createStore,
  fetchImplementation,
  makeById,
  state,
} from '../bootstrap';

import * as actions from '../../actions/login';
import * as types from '../../actions/types';
import Storage from '../../util/Storage';
jest.mock('../../util/Storage');

const original = JSON.parse(JSON.stringify(state));
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
  store = createStore({});
  fetch.mockImplementation(() => {});
  Storage.clear.mockImplementation(() => {});
});

afterEach(() => {
  fetch.mockReset();
  Storage.clear.mockReset();
});

test('LOG_IN', async () => {
  await store.dispatch(actions.logIn({ username: 'me', otherdata: true }));
  assert.deepEqual(store.getState().login,  {
    isLoggedIn: true,
    username: 'me',
    permissions: [],
    otherdata: true
  });
});

test('LOG_OUT', async () => {
  await store.dispatch(actions.logIn({ username: 'me', otherdata: true }));
  assert.deepEqual(store.getState().login,  {
    isLoggedIn: true,
    username: 'me',
    permissions: [],
    otherdata: true
  });
  await store.dispatch(actions.logOut({ username: null, permissions: [] }));
  assert.equal(Storage.clear.mock.calls.length, 1);
  assert.equal(fetch.mock.calls.length, 1);
  assert.deepEqual(store.getState().login,  {
    isLoggedIn: false,
    username: 'me',
    permissions: [],
    otherdata: true
  });
});
