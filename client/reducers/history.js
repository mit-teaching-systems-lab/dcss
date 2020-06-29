import { GET_RUN_HISTORY_SUCCESS } from '@actions/types';

const initialState = {
  prompts: [],
  responses: []
};

export const history = (state = initialState, action) => {
  const { history, type } = action;
  switch (type) {
    case GET_RUN_HISTORY_SUCCESS:
      return {
        ...state,
        ...history
      };
    default:
      return state;
  }
};
