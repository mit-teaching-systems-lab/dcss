import assert from 'assert';
import {
  createPseudoRealStore,
  fetchImplementation,
  state
} from '../bootstrap';

import * as actions from '../../actions/history';
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
});

afterEach(() => {
  jest.resetAllMocks();
});

test('GET_RUN_HISTORY_SUCCESS', async () => {
  const history = {
    prompts: [{ id: 1, prompt: 'how are you?' }],
    responses: [{ id: 1, value: 'Fine, I guess' }]
  };

  fetchImplementation(fetch, 200, { history });

  {
    const returnValue = await store.dispatch(actions.getHistoryForScenario(42));
    expect(fetch.mock.calls[0]).toEqual(['/api/history/42']);
    expect(store.getState().history).toEqual(history);
    expect(returnValue).toEqual(history);
  }

  {
    const store = createPseudoRealStore({});
    const returnValue = await store.dispatch(
      actions.getHistoryForScenario(42, 1)
    );
    expect(fetch.mock.calls[1]).toEqual(['/api/history/42/cohort/1']);
    expect(store.getState().history).toEqual(history);
    expect(returnValue).toEqual(history);
  }
});

test('GET_RUN_HISTORY_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getHistoryForScenario(42));

  expect(fetch.mock.calls[0]).toEqual(['/api/history/42']);
  expect(store.getState().errors.history.error).toEqual(error);
  expect(returnValue).toEqual(null);
});
