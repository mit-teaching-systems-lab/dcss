import {
  LOG_OUT,
  GET_PERMISSIONS_SUCCESS,
  SET_SESSION_SUCCESS
} from '@actions/types';

import { sessionInitialState } from './initial-states';

export const session = (state = sessionInitialState, action) => {
  const { permissions, session, type } = action;
  switch (type) {
    case GET_PERMISSIONS_SUCCESS: {
      return {
        isLoggedIn: true,
        permissions
      };
    }
    case SET_SESSION_SUCCESS: {
      return {
        ...state,
        ...session
      };
    }
    case LOG_OUT: {
      return {
        ...sessionInitialState
      };
    }
    default:
      return state;
  }
};
