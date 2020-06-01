import {
  GET_USER_ERROR,
  GET_USER_SUCCESS,
  // GET_USERS_SUCCESS,
  SET_USER_SUCCESS
  // SET_USERS_SUCCESS
} from '@client/actions/types';

const initialState = {
  username: null,
  email: null,
  id: null,
  roles: []
};

export const user = (state = initialState, action) => {
  const { user, type } = action;
  switch (type) {
    // GET_USER_SUCCESS, SET_USER_SUCCESS:
    // user will be an object with the same
    // shape as initialState, overriding its
    // properties.
    // GET_USER_ERROR: user will be undefined,
    // falling back to initialState
    case GET_USER_SUCCESS:
    case SET_USER_SUCCESS:
    case GET_USER_ERROR:
      return {
        ...state,
        ...user
      };
    default:
      return state;
  }
};
