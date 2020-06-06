import {
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  SET_USER
  // SET_USER_SUCCESS,
  // SET_USER_ERROR
} from './types';

export const setUser = user => ({
  type: SET_USER,
  user
});

export const getUser = () => async dispatch => {
  try {
    const user = await (await fetch('/api/auth/me')).json();
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  } catch (error) {
    dispatch({ type: GET_USER_ERROR, error });
    return error;
  }
};
