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
    assert.deepEqual(reducer.response(undefined, {}), responseInitialState);
    assert.deepEqual(reducer.response(undefined, {}), responseInitialState);
    assert.deepEqual(reducer.responses(undefined, {}), initialState);
    assert.deepEqual(reducer.responses(undefined, {}), initialState);
    assert.deepEqual(reducer.responsesById(undefined, {}), initialStateById);
    assert.deepEqual(reducer.responsesById(undefined, {}), initialStateById);
  });

  test('GET_RESPONSE_SUCCESS 1', () => {
    const action = {
      type: types.GET_RESPONSE_SUCCESS,
      response
    };
    assert.deepEqual(reducer.response(undefined, action), response);
    assert.deepEqual(reducer.response(undefined, action), response);
  });

  test('GET_RESPONSE_SUCCESS 2', () => {
    const action = {
      type: types.GET_RESPONSE_SUCCESS,
      response
    };
    expect(reducer.responses(state, action)).toMatchSnapshot();
  });

  test('GET_RESPONSES_SUCCESS 1', () => {
    const action = {
      type: types.GET_RESPONSES_SUCCESS,
      responses
    };
    expect(reducer.responses(state, action)).toMatchSnapshot();
    expect(reducer.responsesById(state, action)).toMatchSnapshot();
  });

  test('GET_RESPONSES_SUCCESS 2', () => {
    const action = {
      type: types.GET_RESPONSES_SUCCESS,
      responsesById
    };
    expect(reducer.responsesById(state, action)).toMatchSnapshot();
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
    expect(reducer.responses(state, action)).toMatchSnapshot();
    expect(reducer.responsesById(state, action)).toMatchSnapshot();
  });
});
