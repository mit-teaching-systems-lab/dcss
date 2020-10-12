import assert from 'assert';
import {
  state,
  createStore
} from '../bootstrap';

import * as actions from '../../actions/history';
import * as types from '../../actions/types';

let original = JSON.parse(JSON.stringify(state));
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  fetch.mockRestore();
});

beforeEach(() => {
  store = createStore(original);
});

afterEach(() => {
  fetch.mockReset();
});

test('GET_RUN_HISTORY_SUCCESS', async () => {
  const history = { prompts: [{id: 1, prompt: 'how are you?'}], responses: [{id: 1, value: 'Fine, I guess'}] };
  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ history });
      },
    });
  });

  {
    const returnValue = await store.dispatch(actions.getHistoryForScenario(42));
    assert.deepEqual(fetch.mock.calls[0], [ '/api/history/42' ]);
    // console.log(store.getState().history);
    assert.deepEqual(store.getState().history, history);
    assert.deepEqual(returnValue, history);
  }

  {
    const store = createStore(original);
    const returnValue = await store.dispatch(actions.getHistoryForScenario(42, 1));
    assert.deepEqual(fetch.mock.calls[1], [ '/api/history/42/cohort/1' ]);
    // console.log(store.getState().history);
    assert.deepEqual(store.getState().history, history);
    assert.deepEqual(returnValue, history);
  }
});
