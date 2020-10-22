import { LOG_IN, LOG_OUT } from '@actions/types';

import { loginInitialState } from './initial-states';

export default function(state = loginInitialState, action) {
  const { login, type } = action;
  switch (type) {
    case LOG_IN: {
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
