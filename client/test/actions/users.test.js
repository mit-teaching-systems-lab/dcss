import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createPseudoRealStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/users';
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
  store = createPseudoRealStore({});
  fetch.mockImplementation(() => {});
  Storage.has.mockImplementation(() => true);
  Storage.delete.mockImplementation(() => {});
});

afterEach(() => {
  fetch.mockReset();
  Storage.has.mockReset();
  Storage.delete.mockReset();
});

describe('GET_USERS_SUCCESS', () => {
  test('setUsers', async () => {
    const users = state.users.slice();

    fetchImplementation(fetch, 200, { users });

    await store.dispatch(actions.setUsers(users));
    assert.deepEqual(store.getState().usersById, makeById(users));
    assert.deepEqual(store.getState().users, users);
  });
  test('getUsers', async () => {
    const users = state.users.slice();

    fetchImplementation(fetch, 200, { users });

    const returnValue = await store.dispatch(actions.getUsers());
    assert.deepEqual(fetch.mock.calls[0], ['/api/roles/all']);
    assert.deepEqual(store.getState().usersById, makeById(users));
    assert.deepEqual(store.getState().users, users);
    assert.deepEqual(returnValue, users);
  });
  test('getUsers, empty response', async () => {
    const users = state.users.slice();

    fetchImplementation(fetch, 200, {});

    const returnValue = await store.dispatch(actions.getUsers());
    assert.deepEqual(fetch.mock.calls[0], ['/api/roles/all']);
    assert.deepEqual(store.getState().usersById, {});
    assert.deepEqual(store.getState().users, []);
    assert.deepEqual(returnValue, []);
  });
});

test('GET_USERS_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getUsers());
  assert.deepEqual(fetch.mock.calls[0], ['/api/roles/all']);
  assert.deepEqual(store.getState().errors.users.error, error);
  assert.equal(returnValue, null);
});

test('GET_USERS_BY_PERMISSION_SUCCESS', async () => {
  const users = state.users.slice();

  fetchImplementation(fetch, 200, { users });

  const returnValue = await store.dispatch(
    actions.getUsersByPermission('boss')
  );
  assert.deepEqual(fetch.mock.calls[0], ['/api/roles/user/permission/boss']);
  assert.deepEqual(returnValue, users);
});

test('GET_USERS_BY_PERMISSION_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(
    actions.getUsersByPermission('boss')
  );
  assert.deepEqual(fetch.mock.calls[0], ['/api/roles/user/permission/boss']);
  assert.deepEqual(store.getState().errors.users.error, error);
  assert.equal(returnValue, null);
});
