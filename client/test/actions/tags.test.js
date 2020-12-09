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

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  store = createPseudoRealStore({});
  fetch.mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
});

test('GET_CATEGORIES_SUCCESS', async () => {
  const categories = state.tags.categories.slice();

  fetchImplementation(fetch, 200, { categories });

  await store.dispatch(actions.getCategories());
  expect(fetch.mock.calls[0]).toEqual(['/api/tags/categories']);
  expect(store.getState().tags.categories).toEqual(categories);
});

test('GET_CATEGORIES_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getCategories());
  expect(fetch.mock.calls[0]).toEqual(['/api/tags/categories']);
  // assert.deepEqual(store.getState().errors.tags.error, error);
  expect(returnValue).toBe(null);
});
