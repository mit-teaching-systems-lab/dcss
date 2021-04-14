import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createMockConnectedStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/filters';
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

test('SET_FILTER_SCENARIOS_IN_USE', async () => {
  await store.dispatch(actions.setFilterScenariosInUse([1, 2, 3]));

  expect(store.getState().scenariosInUse).toMatchInlineSnapshot(`undefined`);
});
