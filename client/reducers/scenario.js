import {
  GET_SCENARIO_SUCCESS,
  GET_SLIDES_SUCCESS,
  SET_SCENARIO,
  SET_SLIDES
} from '@actions/types';

const initialScenarioState = {
  title: '',
  description: '',
  author: {
    id: null,
    username: ''
  },
  consent: {
    id: null,
    prose: ''
  },
  finish: {
    components: [],
    is_finish: true,
    title: ''
  },
  slides: [],
  status: 1
};

export const scenario = (state = initialScenarioState, action) => {
  const { scenario, slides, type } = action;
  switch (type) {
    case SET_SCENARIO:
    case GET_SCENARIO_SUCCESS:
      return {
        ...state,
        ...scenario
      };
    case SET_SLIDES:
    case GET_SLIDES_SUCCESS:
      return {
        ...state,
        slides
      };
    default:
      return state;
  }
};
