import {
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  SET_USER_SUCCESS,
  SET_USER_ERROR
} from './types';

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

export const setUser = data => async dispatch => {
  try {
    if (Object.values(data).length) {
      const body = JSON.stringify(data);
      const user = await (await fetch('/api/auth/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })).json();

      if (user.error) {
        throw user;
      }

      dispatch({ type: SET_USER_SUCCESS, user });
      return user;
    }
  } catch (error) {
    dispatch({ type: SET_USER_ERROR, error });
    return error;
  }
};
