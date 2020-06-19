import {
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  SET_USER_SUCCESS,
  SET_USER_ERROR
} from './types';

export const getUser = () => async dispatch => {
  try {
    const res = await (await fetch('/api/auth/me')).json();

    if (res.error) {
      throw res;
    }
    const {
      user
    } = res;

    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  } catch (error) {
    dispatch({ type: GET_USER_ERROR, error });
    return null;
  }
};

export const setUser = data => async dispatch => {
  try {
    if (Object.values(data).length) {
      const body = JSON.stringify(data);
      const res = await (await fetch('/api/auth/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })).json();

      if (res.error) {
        throw res;
      }
      const {
        user
      } = res;

      dispatch({ type: SET_USER_SUCCESS, user });
      return user;
    }
  } catch (error) {
    dispatch({ type: SET_USER_ERROR, error });
    return null;
  }
};
