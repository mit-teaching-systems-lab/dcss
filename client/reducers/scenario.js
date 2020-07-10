import {
  GET_SCENARIO_SUCCESS,
  GET_SLIDES_SUCCESS,
  SET_SCENARIO,
  SET_SLIDES
} from '@actions/types';

export const initialScenarioState = {
  // TODO: Phase out author
  author: {
    id: null,
    username: ''
  },
  categories: [],
  consent: {
    id: null,
    prose: ''
  },
  description: undefined,
  finish: {
    components: [],
    is_finish: true,
    title: ''
  },
  lock: null,
  slides: [],
  status: 1,
  title: '',
  users: []
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
