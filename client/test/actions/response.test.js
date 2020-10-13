import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  state,
  createStore
} from '../bootstrap';

import * as actions from '../../actions/response';
import * as types from '../../actions/types';

let original = JSON.parse(JSON.stringify(state));
let store;
let response = {
  content: "",
  created_at: "2020-03-13T00:50:34.648Z",
  ended_at: "2020-03-13T00:50:35.645Z",
  isSkip: false,
  type: "TextResponse",
  value: "sdfsdfsdfsdf",
};

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

test('GET_RESPONSE_SUCCESS', async () => {
  const responseId = uuid();
  const request = { id: 1, responseId };
  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ response });
      },
    });
  });

  const returnValue = await store.dispatch(actions.getResponse(request));

  assert.deepEqual(fetch.mock.calls[0], [ `/api/runs/1/response/${responseId}` ]);

  assert.deepEqual(store.getState().response, response);
  assert.deepEqual(store.getState().responses, [response]);
});

test('GET_RESPONSE_ERROR', async () => {
  const responseId = uuid();
  const request = { id: 1, responseId };
  const error = new Error('something unexpected happened on the server');

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ error });
      },
    });
  });

  const returnValue = await store.dispatch(actions.getResponse(request));

  assert.deepEqual(fetch.mock.calls[0], [ `/api/runs/1/response/${responseId}` ]);

  const { errors: { response } } = store.getState();

  // The current value of the errors.response property will
  // be whatever error info the server returned.
  assert.deepEqual(error, response.error);
  assert.equal(returnValue, null);
});
