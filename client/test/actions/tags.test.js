import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createPseudoRealStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/tags';
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

test('GET_CATEGORIES_SUCCESS', async () => {
  const categories = state.tags.categories.slice();

  fetchImplementation(fetch, 200, { categories });

  await store.dispatch(actions.getCategories());
  assert.deepEqual(fetch.mock.calls[0], ['/api/tags/categories']);
  assert.deepEqual(store.getState().tags.categories, categories);
});

test('GET_CATEGORIES_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getCategories());
  assert.deepEqual(fetch.mock.calls[0], ['/api/tags/categories']);
  // assert.deepEqual(store.getState().errors.tags.error, error);
  assert.equal(returnValue, null);
});
