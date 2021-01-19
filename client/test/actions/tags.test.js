import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createMockConnectedStore,
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
  store = createMockConnectedStore({});
  fetch.mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
});

test('GET_CATEGORIES_SUCCESS', async () => {
  const categories = state.tags.categories.slice();

  fetchImplementation(fetch, 200, { categories });

  await store.dispatch(actions.getCategories());
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/tags/categories",
    ]
  `);
  expect(store.getState().tags.categories).toMatchInlineSnapshot(`Array []`);
});

test('GET_CATEGORIES_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getCategories());
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/tags/categories",
    ]
  `);
  // assert.deepEqual(store.getState().errors.tags.error, error);
  expect(returnValue).toBe(null);
});

describe('GET_LABELS_SUCCESS', () => {
  let labels;

  beforeEach(() => {
    labels = [
      { id: 940, name: 'Kermit', count: '4' },
      { id: 941, name: 'Big Bird', count: '3' },
      { id: 939, name: 'Grover', count: '2' },
      { id: 932, name: 'Elmo', count: '1' }
    ];
  });

  test('getLabels', async () => {
    fetchImplementation(fetch, 200, { labels });

    await store.dispatch(actions.getLabels());
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/tags/labels",
      ]
    `);
    expect(store.getState().tags.labels).toMatchInlineSnapshot(`
      Array [
        Object {
          "count": "4",
          "key": 940,
          "text": "Kermit",
          "value": "Kermit",
        },
        Object {
          "count": "3",
          "key": 941,
          "text": "Big Bird",
          "value": "Big Bird",
        },
        Object {
          "count": "2",
          "key": 939,
          "text": "Grover",
          "value": "Grover",
        },
        Object {
          "count": "1",
          "key": 932,
          "text": "Elmo",
          "value": "Elmo",
        },
      ]
    `);
  });

  test('getLabelsByOccurrence', async () => {
    fetchImplementation(fetch, 200, { labels });

    await store.dispatch(actions.getLabelsByOccurrence());
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/tags/labels/occurrence/desc",
      ]
    `);
    expect(store.getState().tags.labels).toMatchInlineSnapshot(`
      Array [
        Object {
          "count": "4",
          "key": 940,
          "text": "Kermit",
          "value": "Kermit",
        },
        Object {
          "count": "3",
          "key": 941,
          "text": "Big Bird",
          "value": "Big Bird",
        },
        Object {
          "count": "2",
          "key": 939,
          "text": "Grover",
          "value": "Grover",
        },
        Object {
          "count": "1",
          "key": 932,
          "text": "Elmo",
          "value": "Elmo",
        },
      ]
    `);
  });
});

describe('SET_LABELS_IN_USE_SUCCESS', () => {
  test('setLabelsInUse', async () => {
    await store.dispatch(actions.setLabelsInUse(['X', 'Y', 'X']));
    expect(store.getState().tags.labelsInUse).toMatchInlineSnapshot(`
      Array [
        "X",
        "Y",
        "X",
      ]
    `);
  });
});

describe('GET_LABELS_ERROR', () => {
  test('getLabels', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getLabels());
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/tags/labels",
      ]
    `);
    expect(returnValue).toBe(null);
  });
  test('getLabelsByOccurrence', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getLabelsByOccurrence());
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/tags/labels/occurrence/desc",
      ]
    `);
    expect(returnValue).toBe(null);
  });
});
