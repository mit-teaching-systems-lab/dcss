import assert from 'assert';
import { state } from '../bootstrap';

import { scenarioInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/scenario';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('scenario', () => {
  let state;
  let scenario;
  let slides;

  beforeEach(() => {

    state = {
      id: Infinity,
      title: 'The Wrong One'
    };

    scenario = {
      ...original.scenario
    };

    scenario.slides = [];

    slides = [
      ...original.scenario.slides
    ];
  });

  test('initial state', () => {
    expect(reducer.scenario(undefined, {})).toEqual(scenarioInitialState);
    expect(reducer.scenario(undefined, {})).toEqual(scenarioInitialState);
  });

  test('GET_SCENARIO_SUCCESS', () => {
    const action = {
      type: types.GET_SCENARIO_SUCCESS,
      scenario
    };
    expect(reducer.scenario(undefined, action)).toMatchSnapshot();
    expect(reducer.scenario(undefined, action)).toMatchSnapshot();
  });

  test('SET_SCENARIO', () => {
    const action = {
      type: types.SET_SCENARIO,
      scenario
    };
    expect(reducer.scenario(undefined, action)).toMatchSnapshot();
    expect(reducer.scenario(undefined, action)).toMatchSnapshot();
  });

  test('GET_SLIDES_SUCCESS', () => {
    const action = {
      type: types.GET_SLIDES_SUCCESS,
      slides
    };
    expect(reducer.scenario(state, action)).toMatchSnapshot();
    expect(reducer.scenario(state, action)).toMatchSnapshot();
  });

  test('SET_SLIDES', () => {
    const action = {
      type: types.SET_SLIDES,
      slides
    };
    expect(reducer.scenario(state, action)).toMatchSnapshot();
    expect(reducer.scenario(state, action)).toMatchSnapshot();
  });

  test('DELETE_SLIDE_SUCCESS', () => {
    const action = {
      type: types.DELETE_SLIDE_SUCCESS,
      slides: slides.slice(1,2)
    };
    expect(reducer.scenario(state, action)).toMatchSnapshot();
    expect(reducer.scenario(state, action)).toMatchSnapshot();
  });
});
