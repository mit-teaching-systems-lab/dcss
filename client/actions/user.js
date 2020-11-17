import Crypto from 'crypto-js';
import {
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  SET_USER_SUCCESS,
  SET_USER_ERROR
} from './types';

export const signUp = params => async dispatch => {
  try {
    let { email = '', username = '', password = '' } = params;
    let data = {};

    if (email) {
      data.email = email.trim();
    }

    if (username) {
      data.username = username.trim();
    }

    if (password) {
      /* SESSION_SECRET is "embedded" by webpack */
      data.password = Crypto.AES.encrypt(password, SESSION_SECRET).toString();
    }

    const body = JSON.stringify(data);

    const res = await (
      await fetch('/api/auth/signup', {
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

    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  } catch (error) {
    dispatch({ type: GET_USER_ERROR, error });
    return null;
  }
};

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

export let setUser = params => async dispatch => {
  try {
    if (Object.values(params).length) {
      if (params.password) {
        /* SESSION_SECRET is "embedded" by webpack */
        params.password = Crypto.AES.encrypt(
          params.password,
          SESSION_SECRET
        ).toString();
      }
      const body = JSON.stringify(params);
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
    return null;
  } catch (error) {
    dispatch({ type: SET_USER_ERROR, error });
    return null;
  }
};

export let resetPassword = params => async () => {
  try {
    if (Object.values(params).length) {
      params.email = Crypto.AES.encrypt(params.email, SESSION_SECRET).toString();
      params.origin = location.origin;
      const body = JSON.stringify(params);
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
    return null;
  } catch (error) {
    return null;
  }
};
