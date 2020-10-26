import assert from 'assert';
import { state } from '../bootstrap';

import * as reducer from '../../reducers/scenarios';
import * as types from '../../actions/types';

const initialState = [];
const initialStateById = {};

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('scenarios', () => {
  let state;
  let scenario;
  let scenarios;
  let scenariosById;

  beforeEach(() => {

    state = {
      id: Infinity,
      title: 'The Wrong One'
    };

    scenario = {
      ...original.scenario
    };

    scenarios = [
      ...original.scenarios
    ];

    scenariosById = {
      ...original.scenariosById
    };

  });

  test('initial state', () => {
    expect(reducer.scenarios(undefined, {})).toEqual(initialState);
    expect(reducer.scenarios(undefined, {})).toEqual(initialState);
    expect(reducer.scenariosById(undefined, {})).toEqual(initialStateById);
    expect(reducer.scenariosById(undefined, {})).toEqual(initialStateById);
  });

  test('GET_SCENARIOS_SUCCESS', () => {
    const action = {
      type: types.GET_SCENARIOS_SUCCESS,
      scenarios
    };
    expect(reducer.scenarios(undefined, action)).toMatchSnapshot();
    expect(reducer.scenarios(undefined, action)).toMatchSnapshot();
  });

  test('SET_SCENARIOS', () => {
    const action = {
      type: types.SET_SCENARIOS,
      scenarios
    };
    expect(reducer.scenarios(undefined, action)).toMatchSnapshot();
    expect(reducer.scenarios(undefined, action)).toMatchSnapshot();
  });

  test('GET_SCENARIOS_SUCCESS', () => {
    const action = {
      type: types.GET_SCENARIOS_SUCCESS,
      scenarios
    };
    expect(reducer.scenariosById(undefined, action)).toMatchSnapshot();
    expect(reducer.scenariosById(undefined, action)).toMatchSnapshot();
  });

  test('SET_SCENARIOS', () => {
    const action = {
      type: types.SET_SCENARIOS,
      scenarios
    };
    expect(reducer.scenariosById(undefined, action)).toMatchSnapshot();
    expect(reducer.scenariosById(undefined, action)).toMatchSnapshot();
  });

  test('DELETE_SCENARIO_SUCCESS', () => {
    const action = {
      type: types.DELETE_SCENARIO_SUCCESS,
      scenarios
    };
    expect(reducer.scenarios(undefined, action)).toMatchSnapshot();
    expect(reducer.scenarios(undefined, action)).toMatchSnapshot();
  });

  test('UNLOCK_SCENARIO_SUCCESS', () => {
    const action = {
      type: types.UNLOCK_SCENARIO_SUCCESS,
      scenarios
    };
    expect(reducer.scenarios(undefined, action)).toMatchSnapshot();
    expect(reducer.scenarios(undefined, action)).toMatchSnapshot();
  });

  test('DELETE_SCENARIO_SUCCESS', () => {
    const action = {
      type: types.DELETE_SCENARIO_SUCCESS,
      scenarios
    };
    expect(reducer.scenariosById(undefined, action)).toMatchSnapshot();
    expect(reducer.scenariosById(undefined, action)).toMatchSnapshot();
  });

  test('UNLOCK_SCENARIO_SUCCESS', () => {
    const action = {
      type: types.UNLOCK_SCENARIO_SUCCESS,
      scenarios
    };
    expect(reducer.scenariosById(undefined, action)).toMatchSnapshot();
    expect(reducer.scenariosById(undefined, action)).toMatchSnapshot();
  });
});
