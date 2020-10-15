import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/run';
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

test('GET_RUN_SUCCESS', async () => {
  const run = { ...state.run };

  fetchImplementation(fetch, 200, { run });

  const returnValue = await store.dispatch(actions.getRun(1));

  assert.deepEqual(fetch.mock.calls[0], [
    '/api/runs/new-or-existing/scenario/1',
    { method: 'PUT', headers: { 'Content-Type': 'application/json' } }
  ]);
  assert.deepEqual(store.getState().runsById, makeById([run]));
  assert.deepEqual(store.getState().run, run);
  assert.deepEqual(returnValue, run);
});

test('GET_RUN_ERROR', async () => {

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getRun(1));

  assert.deepEqual(fetch.mock.calls[0], [
    '/api/runs/new-or-existing/scenario/1',
    { method: 'PUT', headers: { 'Content-Type': 'application/json' } }
  ]);
  assert.deepEqual(store.getState().errors.run.error, error);
  assert.equal(returnValue, null);
});
