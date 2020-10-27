import Crypto from 'crypto-js';
import {
  GET_SESSION_SUCCESS,
  GET_SESSION_ERROR,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  SET_USER_SUCCESS,
  SET_USER_ERROR
} from './types';

export let getUser = () => async dispatch => {
  try {
    const res = await (await fetch('/api/auth/me')).json();

    if (res.error) {
      throw res;
    }
    const { user } = res;

    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  } catch (error) {
    dispatch({ type: GET_USER_ERROR, error });
    return null;
  }
};

export let getSession = () => async dispatch => {
  try {
    const res = await (await fetch('/api/auth/session')).json();

    if (res.error) {
      throw res;
    }
    const { user } = res;

    dispatch({ type: GET_SESSION_SUCCESS, user });
    return user;
  } catch (error) {
    dispatch({ type: GET_SESSION_ERROR, error });
    return null;
  }
};

export let setUser = data => async dispatch => {
  try {
    if (Object.values(data).length) {
      const body = JSON.stringify(data);
      const res = await (
        await fetch('/api/auth/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body
        })
      ).json();

      if (res.error) {
        throw res;
      }
      const { user } = res;

      dispatch({ type: SET_USER_SUCCESS, user });
      return user;
    }
  } catch (error) {
    dispatch({ type: SET_USER_ERROR, error });
    return null;
  }
};

export let resetPassword = data => async dispatch => {
  try {
    if (Object.values(data).length) {
      data.email = Crypto.AES.encrypt(data.email, SESSION_SECRET).toString();
      const body = JSON.stringify(data);
      const res = await (
        await fetch('/api/auth/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body
        })
      ).json();

      if (res.error) {
        throw res;
      }
      const { reset } = res;
      return reset;
    }
  } catch (error) {
    return null;
  }
};
