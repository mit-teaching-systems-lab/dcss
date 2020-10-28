import { LOG_OUT, SET_IS_LOGGED_IN } from '@actions/types';

import { loginInitialState } from './initial-states';

export default function(state = loginInitialState, action) {
  const { login, type } = action;
  switch (type) {
    case SET_IS_LOGGED_IN: {
      return {
        ...state,
        ...login
      };
    }
    case LOG_OUT: {
      return {
        ...loginInitialState
      };
    }
    default:
      return state;
  }
}
