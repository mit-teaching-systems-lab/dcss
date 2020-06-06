import {
  GET_SCENARIOS_SUCCESS,
  // GET_SCENARIOS_ERROR,
  SET_SCENARIOS
  // SET_SCENARIOS_SUCCESS,
  // SET_SCENARIOS_ERROR,
} from '@client/actions/types';

export const scenarios = (state = [], action) => {
  const { scenarios, type } = action;

  switch (type) {
    case SET_SCENARIOS:
    case GET_SCENARIOS_SUCCESS:
      return [...state, ...scenarios];
    default:
      return state;
  }
};
