import assert from 'assert';
import { state } from '../bootstrap';

import { historyInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/history';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('history', () => {
  let state;
  let history;
  beforeEach(() => {
    state = {
      prompts: [1, 2, 3],
      responses: [4, 5, 6]
    };
    history = {
      prompts: [],
      responses: []
    };
  });

  test('initial state', () => {
    expect(reducer.history(undefined, {})).toEqual(historyInitialState);
    expect(reducer.history(undefined, {})).toEqual(historyInitialState);
  });

  test('GET_RUN_HISTORY_SUCCESS', () => {
    const action = {
      type: types.GET_RUN_HISTORY_SUCCESS,
      history
    };
    expect(reducer.history(undefined, action)).toEqual(history);
    expect(reducer.history(undefined, action)).toEqual(history);
  });

  test('GET_RUN_HISTORY_SUCCESS', () => {
    const action = {
      type: types.GET_RUN_HISTORY_SUCCESS,
      history
    };
    expect(reducer.history(state, action)).toEqual(history);
    expect(reducer.history(state, action)).toEqual(history);
  });
});
