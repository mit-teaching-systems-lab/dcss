import {
  GET_SESSION_SUCCESS,
  GET_USER_SUCCESS,
  SET_USER_SUCCESS
} from '@actions/types';

import { userInitialState } from './initial-states';

export const user = (state = userInitialState, action) => {
  const { user, type } = action;
  switch (type) {
    // GET_SESSION_SUCCESS, GET_USER_SUCCESS, SET_USER_SUCCESS:
    // user will be an object with the same
    // shape as initialState, overriding its
    // properties.
    // GET_USER_ERROR: user will be undefined,
    // falling back to initialState
    case GET_SESSION_SUCCESS:
    case GET_USER_SUCCESS:
    case SET_USER_SUCCESS: {
      if (user === null) {
        return {
          ...userInitialState
        };
      }
      return {
        ...state,
        ...user
      };
    }
    default:
      return state;
  }
};
