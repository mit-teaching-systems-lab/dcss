import {
  DELETE_SLIDE_SUCCESS,
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
