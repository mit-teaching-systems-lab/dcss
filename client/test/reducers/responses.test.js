import assert from 'assert';
import { state } from '../bootstrap';

import { responseInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/response';
import * as types from '../../actions/types';

const initialState = [];
const initialStateById = {};
const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('responses', () => {
  let state;
  let response;
  let responses;
  let responsesById;

  beforeEach(() => {
    state = [];
    response = {
      id: 1,
      response_id: 'ABC',
      response: { id: 1 }
    };
    responses = [
      { id: 1, response_id: 'ABC', response: { id: 1 } },
      { id: 1, response_id: 'ABC', response: { id: 1 } }, // this is intentional
      { id: 2, response_id: 'DEF', response: { id: 2 } },
      { id: 3, response_id: 'GHI', response: { id: 3 } }
    ];
    responsesById = {
      ABC: { id: 1, response_id: 'ABC', response: { id: 1 } },
      DEF: { id: 2, response_id: 'DEF', response: { id: 2 } },
      GHI: { id: 3, response_id: 'GHI', response: { id: 3 } }
    };
  });

  test('initial state', () => {
    expect(reducer.response(undefined, {})).toEqual(responseInitialState);
    expect(reducer.response(undefined, {})).toEqual(responseInitialState);
    expect(reducer.responses(undefined, {})).toEqual(initialState);
    expect(reducer.responses(undefined, {})).toEqual(initialState);
    expect(reducer.responsesById(undefined, {})).toEqual(initialStateById);
    expect(reducer.responsesById(undefined, {})).toEqual(initialStateById);
  });

  test('GET_RESPONSE_SUCCESS 1', () => {
    const action = {
      type: types.GET_RESPONSE_SUCCESS,
      response
    };
    expect(reducer.response(undefined, action)).toEqual(response);
    expect(reducer.response(undefined, action)).toEqual(response);
  });

  test('GET_RESPONSE_SUCCESS 2', () => {
    const action = {
      type: types.GET_RESPONSE_SUCCESS,
      response
    };
    expect(reducer.responses(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": 1,
          "response": Object {
            "id": 1,
          },
          "response_id": "ABC",
        },
      ]
    `);
  });

  test('GET_RESPONSES_SUCCESS 1', () => {
    const action = {
      type: types.GET_RESPONSES_SUCCESS,
      responses
    };
    expect(reducer.responses(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": 1,
          "response": Object {
            "id": 1,
          },
          "response_id": "ABC",
        },
        Object {
          "id": 2,
          "response": Object {
            "id": 2,
          },
          "response_id": "DEF",
        },
        Object {
          "id": 3,
          "response": Object {
            "id": 3,
          },
          "response_id": "GHI",
        },
      ]
    `);
    expect(reducer.responsesById(state, action)).toMatchInlineSnapshot(`
      Object {
        "ABC": Object {
          "id": 1,
          "response": Object {
            "id": 1,
          },
          "response_id": "ABC",
        },
        "DEF": Object {
          "id": 2,
          "response": Object {
            "id": 2,
          },
          "response_id": "DEF",
        },
        "GHI": Object {
          "id": 3,
          "response": Object {
            "id": 3,
          },
          "response_id": "GHI",
        },
      }
    `);
  });

  test('GET_RESPONSES_SUCCESS 2', () => {
    const action = {
      type: types.GET_RESPONSES_SUCCESS,
      responsesById
    };
    expect(reducer.responsesById(state, action)).toMatchInlineSnapshot(`
      Object {
        "ABC": Object {
          "id": 1,
          "response": Object {
            "id": 1,
          },
          "response_id": "ABC",
        },
        "DEF": Object {
          "id": 2,
          "response": Object {
            "id": 2,
          },
          "response_id": "DEF",
        },
        "GHI": Object {
          "id": 3,
          "response": Object {
            "id": 3,
          },
          "response_id": "GHI",
        },
      }
    `);
  });

  test('GET_RESPONSES_SUCCESS 3', () => {
    const action = {
      type: types.GET_RESPONSES_SUCCESS,
      responses: [
        { id: 1, response: { id: 1 } },
        { id: 1, response: { id: 1 } }, // this is intentional
        { id: 2, response_id: 'DEF', response: { id: 2 } },
        { id: 3, response_id: 'GHI', response: { id: 3 } }
      ]
    };
    expect(reducer.responses(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": 1,
          "response": Object {
            "id": 1,
          },
        },
        Object {
          "id": 2,
          "response": Object {
            "id": 2,
          },
          "response_id": "DEF",
        },
        Object {
          "id": 3,
          "response": Object {
            "id": 3,
          },
          "response_id": "GHI",
        },
      ]
    `);
    expect(reducer.responsesById(state, action)).toMatchInlineSnapshot(`
      Object {
        "DEF": Object {
          "id": 2,
          "response": Object {
            "id": 2,
          },
          "response_id": "DEF",
        },
        "GHI": Object {
          "id": 3,
          "response": Object {
            "id": 3,
          },
          "response_id": "GHI",
        },
      }
    `);
  });
});
