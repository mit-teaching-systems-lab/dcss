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
  jest.restoreAllMocks();
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
  jest.resetAllMocks();
});

describe('GET_USERS_SUCCESS', () => {
  test('setUsers', async () => {
    const users = state.users.slice();

    fetchImplementation(fetch, 200, { users });

    await store.dispatch(actions.setUsers(users));
    expect(store.getState().usersById).toEqual(makeById(users));
    expect(store.getState().users).toEqual(users);
  });
  test('getUsers', async () => {
    const users = state.users.slice();

    fetchImplementation(fetch, 200, { users });

    const returnValue = await store.dispatch(actions.getUsers());
    expect(fetch.mock.calls[0]).toEqual(['/api/roles/all']);
    expect(store.getState().usersById).toEqual(makeById(users));
    expect(store.getState().users).toEqual(users);
    expect(returnValue).toEqual(users);
  });
  test('getUsers, empty response', async () => {
    const users = state.users.slice();

    fetchImplementation(fetch, 200, {});

    const returnValue = await store.dispatch(actions.getUsers());
    expect(fetch.mock.calls[0]).toEqual(['/api/roles/all']);
    expect(store.getState().usersById).toEqual({});
    expect(store.getState().users).toEqual([]);
    expect(returnValue).toEqual([]);
  });
});

test('GET_USERS_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getUsers());
  expect(fetch.mock.calls[0]).toEqual(['/api/roles/all']);
  expect(store.getState().errors.users.error).toEqual(error);
  expect(returnValue).toBe(null);
});

test('GET_USERS_BY_PERMISSION_SUCCESS', async () => {
  const users = state.users.slice();

  fetchImplementation(fetch, 200, { users });

  const returnValue = await store.dispatch(
    actions.getUsersByPermission('boss')
  );
  expect(fetch.mock.calls[0]).toEqual(['/api/roles/user/permission/boss']);
  expect(returnValue).toEqual(users);
});

test('GET_USERS_BY_PERMISSION_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(
    actions.getUsersByPermission('boss')
  );
  expect(fetch.mock.calls[0]).toEqual(['/api/roles/user/permission/boss']);
  expect(store.getState().errors.users.error).toEqual(error);
  expect(returnValue).toBe(null);
});
