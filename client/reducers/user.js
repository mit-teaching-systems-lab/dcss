import {
  GET_SESSION_SUCCESS,
  GET_USER_SUCCESS,
  SET_USER_SUCCESS
} from '@actions/types';

const initialState = {
  username: null,
  email: null,
  id: null,
  roles: []
};

export const user = (state = initialState, action) => {
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
      return {
        ...state,
        ...user
      };
    }
    default:
      return state;
  }
};
