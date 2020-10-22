import assert from 'assert';
import {
  createPseudoRealStore,
  fetchImplementation,
  makeById,
  state
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
  store = createPseudoRealStore({});
  fetch.mockImplementation(() => {});
  Storage.clear.mockImplementation(() => {});
});

afterEach(() => {
  fetch.mockReset();
  Storage.clear.mockReset();
});

test('LOG_IN', async () => {
  const login = {
    username: 'me',
    permissions: ['a', 'b', 'c'],
    otherdata: true
  };

  await store.dispatch(actions.logIn(login));
  assert.deepEqual(store.getState().login, {
    isLoggedIn: true,
    ...login
  });
});

test('LOG_OUT', async () => {
  const login = {
    username: 'me',
    permissions: ['a', 'b', 'c'],
    otherdata: true
  };

  await store.dispatch(actions.logIn(login));
  assert.deepEqual(store.getState().login, {
    isLoggedIn: true,
    ...login
  });
  await store.dispatch(actions.logOut());
  assert.equal(Storage.clear.mock.calls.length, 1);
  assert.equal(fetch.mock.calls.length, 1);
  assert.deepEqual(store.getState().login, {
    isLoggedIn: false,
    username: '',
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
