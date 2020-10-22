import {
  DELETE_SLIDE_SUCCESS,
  GET_SCENARIO_SUCCESS,
  GET_SLIDES_SUCCESS,
  SET_SCENARIO,
  SET_SLIDES
} from '@actions/types';

import { scenarioInitialState } from './initial-states';

export const scenario = (state = scenarioInitialState, action) => {
  const { scenario, slides, type } = action;
  switch (type) {
    case GET_SCENARIO_SUCCESS:
    case SET_SCENARIO:
      return {
        ...state,
        ...scenario
      };
    case DELETE_SLIDE_SUCCESS:
    case GET_SLIDES_SUCCESS:
    case SET_SLIDES:
      return {
        ...state,
        slides
      };
    default:
      return state;
  }
};
