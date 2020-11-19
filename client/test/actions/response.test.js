import assert from 'assert';
import {
  createPseudoRealStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/response';
import * as types from '../../actions/types';
import Storage from '../../util/Storage';
jest.mock('../../util/Storage');

const original = JSON.parse(JSON.stringify(state));
const audioresponse = {
  id: 406,
  created_at: '2020-03-13T15:35:08.405Z',
  content: '',
  ended_at: '2020-03-13T15:35:13.293Z',
  isSkip: false,
  type: 'AudioPrompt',
  transcript: 'it was me',
  value:
    'audio/125/abcb3c08-6487-46fb-af72-c86679128f3f/2/83dc6025-c66c-4df5-b001-c1f86c38d864.mp3',
  response_id: 'abcb3c08-6487-46fb-af72-c86679128f3f',
  response: []
};
const textresponse = {
  id: 407,
  created_at: '2020-03-13T15:36:00.405Z',
  content: '',
  ended_at: '2020-03-13T15:36:05.293Z',
  isSkip: false,
  type: 'TextResponse',
  value: 'Hello',
  response_id: '46425c73-5fd1-4106-b112-938d9dd3e52b'
};

const originalAudioresponse = JSON.parse(JSON.stringify(audioresponse));
const originalTextresponse = JSON.parse(JSON.stringify(textresponse));

// This is strange, but it is what it is.
// TODO: refactor any locations that rely on this structure.
audioresponse.response = { ...originalAudioresponse };
textresponse.response = { ...originalTextresponse };

let store;
let responseId = '19c70c32-7f4b-4ba1-b2b2-96f33592ccf0';

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

describe('GET_RESPONSE_SUCCESS', () => {
  test('response is not empty', async () => {
    const request = { id: 1, responseId };
    const response = { ...audioresponse };

    fetchImplementation(fetch, 200, { response });

    const returnValue = await store.dispatch(actions.getResponse(request));

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/runs/1/response/19c70c32-7f4b-4ba1-b2b2-96f33592ccf0",
      ]
    `);

    expect(store.getState().responsesById).toMatchInlineSnapshot(`
      Object {
        "abcb3c08-6487-46fb-af72-c86679128f3f": Object {
          "content": "",
          "created_at": "2020-03-13T15:35:08.405Z",
          "ended_at": "2020-03-13T15:35:13.293Z",
          "id": 406,
          "isSkip": false,
          "response": Array [],
          "response_id": "abcb3c08-6487-46fb-af72-c86679128f3f",
          "transcript": "it was me",
          "type": "AudioPrompt",
          "value": "audio/125/abcb3c08-6487-46fb-af72-c86679128f3f/2/83dc6025-c66c-4df5-b001-c1f86c38d864.mp3",
        },
      }
    `);
    assert.deepEqual(store.getState().responsesById, {
      [audioresponse.response_id]: originalAudioresponse
    });
    expect(store.getState().responses).toEqual([audioresponse]);
    expect(store.getState().response).toEqual(originalAudioresponse);
    expect(returnValue).toEqual(response);
  });

  test('response is empty', async () => {
    const request = { id: 1, responseId };
    const response = { ...audioresponse };

    fetchImplementation(fetch, 200, { response: null });

    const returnValue = await store.dispatch(actions.getResponse(request));

    expect(returnValue).toEqual({ response: null });
  });
});

test('GET_RESPONSE_ERROR', async () => {
  const request = { id: 1, responseId };
  const error = new Error('something unexpected happened on the server');

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getResponse(request));

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/runs/1/response/19c70c32-7f4b-4ba1-b2b2-96f33592ccf0",
    ]
  `);
  assert.deepEqual(fetch.mock.calls[0], [`/api/runs/1/response/${responseId}`]);

  assert.deepEqual(store.getState().errors.response.error, error);
  assert.equal(returnValue, null);
});

describe('GET_TRANSCRIPTION_OUTCOME_SUCCESS', () => {
  test('Outcome', async () => {
    const response = {
      response: null,
      transcript: null
    };
    const request = { id: 1, responseId };
    const outcome = { response, transcript: '...' };

    fetchImplementation(fetch, 200, { outcome });

    const returnValue = await store.dispatch(
      actions.getTranscriptionOutcome(request)
    );

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/runs/1/response/19c70c32-7f4b-4ba1-b2b2-96f33592ccf0/transcript",
      ]
    `);
    assert.deepEqual(returnValue, {
      ...response,
      ...outcome
    });
  });

  test('No Outcome', async () => {
    const response = {
      response: null,
      transcript: null
    };
    const request = { id: 1, responseId };

    fetchImplementation(fetch, 200, {});

    const returnValue = await store.dispatch(
      actions.getTranscriptionOutcome(request)
    );

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/runs/1/response/19c70c32-7f4b-4ba1-b2b2-96f33592ccf0/transcript",
      ]
    `);
    assert.deepEqual(returnValue, {
      ...response
    });
  });
});

test('GET_TRANSCRIPTION_OUTCOME_ERROR', async () => {
  const request = { id: 1, responseId };
  const error = new Error('something unexpected happened on the server');

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(
    actions.getTranscriptionOutcome(request)
  );

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/runs/1/response/19c70c32-7f4b-4ba1-b2b2-96f33592ccf0/transcript",
    ]
  `);
  assert.deepEqual(fetch.mock.calls[0], [
    `/api/runs/1/response/${responseId}/transcript`
  ]);
  assert.deepEqual(store.getState().errors.transcript.error, error);
  assert.equal(returnValue, null);
});

describe('SET_RESPONSE_SUCCESS', () => {
  test('has stored response to delete', async () => {
    const map = new Map();

    map.set('abcb3c08-6487-46fb-af72-c86679128f3f', {
      created_at: '2020-03-13T15:35:08.405Z',
      ended_at: '2020-03-13T15:35:13.293Z',
      isSkip: false,
      type: 'AudioPrompt',
      value:
        'audio/125/abcb3c08-6487-46fb-af72-c86679128f3f/2/83dc6025-c66c-4df5-b001-c1f86c38d864.mp3',
      transcript: 'it was me',
      response_id: 'abcb3c08-6487-46fb-af72-c86679128f3f'
    });

    map.set('46425c73-5fd1-4106-b112-938d9dd3e52b', {
      created_at: '2020-03-13T15:36:00.405Z',
      ended_at: '2020-03-13T15:36:05.293Z',
      isSkip: false,
      type: 'TextResponse',
      value: 'Hello',
      response_id: '46425c73-5fd1-4106-b112-938d9dd3e52b'
    });

    fetch.mockImplementation(async () => {
      const response =
        fetch.mock.calls.length === 1
          ? map.get('abcb3c08-6487-46fb-af72-c86679128f3f')
          : map.get('46425c73-5fd1-4106-b112-938d9dd3e52b');

      response.id = fetch.mock.calls.length;
      return {
        status: 200,
        async json() {
          return { response };
        }
      };
    });

    const returnValue = await store.dispatch(
      actions.setResponses(11, [...map])
    );

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/runs/11/response/abcb3c08-6487-46fb-af72-c86679128f3f",
        Object {
          "body": "{\\"created_at\\":\\"2020-03-13T15:35:08.405Z\\",\\"ended_at\\":\\"2020-03-13T15:35:13.293Z\\",\\"isSkip\\":false,\\"type\\":\\"AudioPrompt\\",\\"value\\":\\"audio/125/abcb3c08-6487-46fb-af72-c86679128f3f/2/83dc6025-c66c-4df5-b001-c1f86c38d864.mp3\\",\\"transcript\\":\\"it was me\\",\\"response_id\\":\\"abcb3c08-6487-46fb-af72-c86679128f3f\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
      Array [
        "/api/runs/11/response/46425c73-5fd1-4106-b112-938d9dd3e52b",
        Object {
          "body": "{\\"created_at\\":\\"2020-03-13T15:36:00.405Z\\",\\"ended_at\\":\\"2020-03-13T15:36:05.293Z\\",\\"isSkip\\":false,\\"type\\":\\"TextResponse\\",\\"value\\":\\"Hello\\",\\"response_id\\":\\"46425c73-5fd1-4106-b112-938d9dd3e52b\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);

    assert.deepEqual(store.getState().responsesById, {
      'abcb3c08-6487-46fb-af72-c86679128f3f': map.get(
        'abcb3c08-6487-46fb-af72-c86679128f3f'
      ),
      '46425c73-5fd1-4106-b112-938d9dd3e52b': map.get(
        '46425c73-5fd1-4106-b112-938d9dd3e52b'
      )
    });

    assert.deepEqual(store.getState().responses, [
      map.get('abcb3c08-6487-46fb-af72-c86679128f3f'),
      map.get('46425c73-5fd1-4106-b112-938d9dd3e52b')
    ]);

    assert.deepEqual(returnValue, [
      map.get('abcb3c08-6487-46fb-af72-c86679128f3f'),
      map.get('46425c73-5fd1-4106-b112-938d9dd3e52b')
    ]);

    assert.equal(Storage.has.mock.calls.length, 2);
    assert.equal(Storage.delete.mock.calls.length, 2);
  });

  test('no stored response to delete', async () => {
    Storage.has.mockImplementation(() => false);

    const map = new Map();

    map.set('abcb3c08-6487-46fb-af72-c86679128f3f', {
      created_at: '2020-03-13T15:35:08.405Z',
      ended_at: '2020-03-13T15:35:13.293Z',
      isSkip: false,
      type: 'AudioPrompt',
      value:
        'audio/125/abcb3c08-6487-46fb-af72-c86679128f3f/2/83dc6025-c66c-4df5-b001-c1f86c38d864.mp3',
      transcript: 'it was me',
      response_id: 'abcb3c08-6487-46fb-af72-c86679128f3f'
    });

    map.set('46425c73-5fd1-4106-b112-938d9dd3e52b', {
      created_at: '2020-03-13T15:36:00.405Z',
      ended_at: '2020-03-13T15:36:05.293Z',
      isSkip: false,
      type: 'TextResponse',
      value: 'Hello',
      response_id: '46425c73-5fd1-4106-b112-938d9dd3e52b'
    });

    fetch.mockImplementation(async () => {
      const response =
        fetch.mock.calls.length === 1
          ? map.get('abcb3c08-6487-46fb-af72-c86679128f3f')
          : map.get('46425c73-5fd1-4106-b112-938d9dd3e52b');

      response.id = fetch.mock.calls.length;
      return {
        status: 200,
        async json() {
          return { response };
        }
      };
    });

    const returnValue = await store.dispatch(
      actions.setResponses(11, [...map])
    );

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/runs/11/response/abcb3c08-6487-46fb-af72-c86679128f3f",
        Object {
          "body": "{\\"created_at\\":\\"2020-03-13T15:35:08.405Z\\",\\"ended_at\\":\\"2020-03-13T15:35:13.293Z\\",\\"isSkip\\":false,\\"type\\":\\"AudioPrompt\\",\\"value\\":\\"audio/125/abcb3c08-6487-46fb-af72-c86679128f3f/2/83dc6025-c66c-4df5-b001-c1f86c38d864.mp3\\",\\"transcript\\":\\"it was me\\",\\"response_id\\":\\"abcb3c08-6487-46fb-af72-c86679128f3f\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
      Array [
        "/api/runs/11/response/46425c73-5fd1-4106-b112-938d9dd3e52b",
        Object {
          "body": "{\\"created_at\\":\\"2020-03-13T15:36:00.405Z\\",\\"ended_at\\":\\"2020-03-13T15:36:05.293Z\\",\\"isSkip\\":false,\\"type\\":\\"TextResponse\\",\\"value\\":\\"Hello\\",\\"response_id\\":\\"46425c73-5fd1-4106-b112-938d9dd3e52b\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);

    assert.deepEqual(store.getState().responsesById, {
      'abcb3c08-6487-46fb-af72-c86679128f3f': map.get(
        'abcb3c08-6487-46fb-af72-c86679128f3f'
      ),
      '46425c73-5fd1-4106-b112-938d9dd3e52b': map.get(
        '46425c73-5fd1-4106-b112-938d9dd3e52b'
      )
    });

    assert.deepEqual(store.getState().responses, [
      map.get('abcb3c08-6487-46fb-af72-c86679128f3f'),
      map.get('46425c73-5fd1-4106-b112-938d9dd3e52b')
    ]);

    assert.deepEqual(returnValue, [
      map.get('abcb3c08-6487-46fb-af72-c86679128f3f'),
      map.get('46425c73-5fd1-4106-b112-938d9dd3e52b')
    ]);

    assert.equal(Storage.has.mock.calls.length, 2);
    assert.equal(Storage.delete.mock.calls.length, 0);
  });
});

test('SET_RESPONSE_ERROR', async () => {
  const error = new Error('something unexpected happened on the server');
  const map = new Map();

  map.set('abcb3c08-6487-46fb-af72-c86679128f3f', {
    created_at: '2020-03-13T15:35:08.405Z',
    content: '',
    ended_at: '2020-03-13T15:35:13.293Z',
    isSkip: false,
    type: 'AudioPrompt',
    value:
      'audio/125/abcb3c08-6487-46fb-af72-c86679128f3f/2/83dc6025-c66c-4df5-b001-c1f86c38d864.mp3',
    transcript: 'it was me',
    response_id: 'abcb3c08-6487-46fb-af72-c86679128f3f'
  });

  map.set('46425c73-5fd1-4106-b112-938d9dd3e52b', {
    created_at: '2020-03-13T15:36:00.405Z',
    content: '',
    ended_at: '2020-03-13T15:36:05.293Z',
    isSkip: false,
    type: 'TextResponse',
    value: 'Hello',
    response_id: '46425c73-5fd1-4106-b112-938d9dd3e52b'
  });

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.setResponses(11, [...map]));

  assert.deepEqual(store.getState().errors.responses.error, error);
  assert.equal(returnValue, null);
});
