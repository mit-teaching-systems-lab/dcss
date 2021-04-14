import assert from 'assert';
import { state } from '../bootstrap';

import * as reducer from '../../reducers/filters';
import * as types from '../../actions/types';

const initialState = [];
const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('scenariosInUse', () => {
  let scenariosInUse;

  beforeEach(() => {
    scenariosInUse = [1, 2, 3];
  });

  test('initial state', () => {
    expect(reducer.scenariosInUse(undefined, {})).toEqual(initialState);
    expect(reducer.scenariosInUse(undefined, {})).toEqual(initialState);
  });

  test('SET_FILTER_SCENARIOS_IN_USE', () => {
    const action = {
      type: types.SET_FILTER_SCENARIOS_IN_USE,
      scenariosInUse
    };
    expect(reducer.scenariosInUse(undefined, action)).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
      ]
    `);
    expect(reducer.scenariosInUse(undefined, action)).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
      ]
    `);
  });

  test('SET_FILTER_SCENARIOS_IN_USE dedupe', () => {
    const action = {
      type: types.SET_FILTER_SCENARIOS_IN_USE,
      scenariosInUse: [...scenariosInUse, ...scenariosInUse, ...scenariosInUse]
    };
    expect(reducer.scenariosInUse(undefined, action)).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        1,
        2,
        3,
        1,
        2,
        3,
      ]
    `);
    expect(reducer.scenariosInUse(undefined, action)).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        1,
        2,
        3,
        1,
        2,
        3,
      ]
    `);
  });

  test('SET_FILTER_SCENARIOS_IN_USE missing', () => {
    const action = {
      type: null,
      scenariosInUse
    };
    const existingState = [1, 2, 3];
    expect(reducer.scenariosInUse(existingState, action))
      .toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
      ]
    `);
    expect(reducer.scenariosInUse(existingState, action))
      .toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
      ]
    `);
  });
});
