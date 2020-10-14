import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/role';
import * as types from '../../actions/types';
import Storage from '../../util/Storage';
jest.mock('../../util/Storage');

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

describe('SET_USER_ROLE_SUCCESS', () => {
  test('addUserRole', async () => {
    fetchImplementation(fetch, 200, { addedCount: 1 });

    const returnValue = await store.dispatch(actions.addUserRole(1, 'boss'));
    assert.deepEqual(fetch.mock.calls[0], [
      '/api/roles/add',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"user_id":1,"roles":["boss"]}'
      }
    ]);
    assert.deepEqual(returnValue, { addedCount: 1 });
  });

  test('deletedCount', async () => {
    fetchImplementation(fetch, 200, { deletedCount: 1 });

    const returnValue = await store.dispatch(actions.deleteUserRole(1, 'boss'));
    assert.deepEqual(fetch.mock.calls[0], [
      '/api/roles/delete',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"user_id":1,"roles":["boss"]}'
      }
    ]);
    assert.deepEqual(returnValue, { deletedCount: 1 });
  });
});

test('SET_USER_ROLE_ERROR', async () => {
  const error = new Error('something unexpected happened on the server');

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.addUserRole(1, 'boss'));

  assert.deepEqual(fetch.mock.calls[0], [
    '/api/roles/add',
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: '{"user_id":1,"roles":["boss"]}'
    }
  ]);
  assert.deepEqual(store.getState().errors.role.error, error);
  assert.equal(returnValue, null);
});
