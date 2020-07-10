import cloneDeep from 'lodash/clonedeep';
import {
  // GET_SCENARIO,
  GET_SCENARIO_SUCCESS,
  GET_SCENARIO_ERROR,
  // GET_SCENARIOS,
  GET_SCENARIOS_SUCCESS,
  GET_SCENARIOS_ERROR,
  // GET_SLIDES,
  GET_SLIDES_SUCCESS,
  GET_SLIDES_ERROR,
  SET_SCENARIO,
  // SET_SCENARIO_SUCCESS,
  // SET_SCENARIO_ERROR,
  SET_SCENARIOS,
  // SET_SCENARIOS_SUCCESS,
  // SET_SCENARIOS_ERROR,
  SET_SLIDES
} from './types';

import { initialScenarioState } from '@reducers/scenario';

export const getScenarios = () => async dispatch => {
  try {
    const res = await (await fetch('/api/scenarios')).json();
    if (res.error) {
      throw res;
    }
    const { scenarios } = res;

    dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  } catch (error) {
    dispatch({ type: GET_SCENARIOS_ERROR, error });
    return null;
  }
};

export const getScenario = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/scenarios/${id}`)).json();

    if (res.error) {
      throw res;
    }
    const { scenario } = res;
    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return scenario;
  } catch (error) {
    dispatch({ type: GET_SCENARIO_ERROR, error });
    return null;
  }
};

export const getSlides = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/scenarios/${id}/slides`)).json();

    if (res.error) {
      throw res;
    }

    const { slides } = res;

    dispatch({ type: GET_SLIDES_SUCCESS, slides });
    return slides;
  } catch (error) {
    dispatch({ type: GET_SLIDES_ERROR, error });
    return null;
  }
};

export const setScenario = scenario => {
  if (scenario === null) {
    const clone = cloneDeep(initialScenarioState);
    return {
      type: SET_SCENARIO,
      scenario: {
        ...clone,
        finish: {
          components: [
            {
              html: `<h2>Thanks for participating!</h2>`
            }
          ],
          is_finish: true,
          title: ''
        }
      }
    };
  }

  return {
    type: SET_SCENARIO,
    scenario
  };
};

export const setScenarios = scenarios => ({
  type: SET_SCENARIOS,
  scenarios
});

export const setSlides = slides => ({
  type: SET_SLIDES,
  slides
});
