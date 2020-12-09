import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createPseudoRealStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/role';
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
  Storage.has.mockReset();
  Storage.delete.mockReset();
});

describe('SET_USER_ROLE_SUCCESS', () => {
  test('addUserRole', async () => {
    fetchImplementation(fetch, 200, { addedCount: 1 });

    const returnValue = await store.dispatch(actions.addUserRole(1, 'boss'));
    expect(fetch.mock.calls[0]).toEqual([
      '/api/roles/add',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"user_id":1,"roles":["boss"]}'
      }
    ]);
    expect(returnValue).toEqual({ addedCount: 1 });
  });

  test('deletedCount', async () => {
    fetchImplementation(fetch, 200, { deletedCount: 1 });

    const returnValue = await store.dispatch(actions.deleteUserRole(1, 'boss'));
    expect(fetch.mock.calls[0]).toEqual([
      '/api/roles/delete',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"user_id":1,"roles":["boss"]}'
      }
    ]);
    expect(returnValue).toEqual({ deletedCount: 1 });
  });
});

describe('SET_USER_ROLE_ERROR', () => {
  test('addUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.addUserRole(1, 'boss'));

    expect(fetch.mock.calls[0]).toEqual([
      '/api/roles/add',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"user_id":1,"roles":["boss"]}'
      }
    ]);
    expect(store.getState().errors.role.error).toEqual(error);
    expect(returnValue).toBe(null);
  });

  test('deleteUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.deleteUserRole(1, 'boss'));

    expect(fetch.mock.calls[0]).toEqual([
      '/api/roles/delete',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"user_id":1,"roles":["boss"]}'
      }
    ]);
    expect(store.getState().errors.role.error).toEqual(error);
    expect(returnValue).toBe(null);
  });
});
