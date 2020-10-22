import { GET_RUN_HISTORY_SUCCESS } from '@actions/types';

import { historyInitialState } from './initial-states';

export const history = (state = historyInitialState, action) => {
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
