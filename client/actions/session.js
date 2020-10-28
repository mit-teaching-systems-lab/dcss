import Crypto from 'crypto-js';
import {
  LOG_IN,
  LOG_OUT,
  GET_PERMISSIONS_ERROR,
  GET_PERMISSIONS_SUCCESS,
  GET_SESSION_ERROR,
  GET_SESSION_SUCCESS,
  SET_SESSION_SUCCESS,
  SET_USER_SUCCESS
} from './types';
import Storage from '@utils/Storage';

export const setSession = session => async dispatch => {
  dispatch({
    type: SET_SESSION_SUCCESS,
    session: {
      ...session,
      isLoggedIn: true
    }
  });
};

const method = 'POST';

export const logIn = params => async dispatch => {
  try {
    let { username, password } = params;

    username = username.trim();
    /* SESSION_SECRET is "embedded" by webpack */
    password = Crypto.AES.encrypt(password, SESSION_SECRET).toString();

    const body = JSON.stringify({
      username,
      password
    });

    const { error = '', message = '' } = await (await fetch('/api/auth/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      method,
      body
    })).json();

    dispatch({ type: LOG_IN });

    return { error, message };
  } catch (error) {
    return {
      error,
      message: error.message
    };
  }
};

export const logOut = () => async dispatch => {
  dispatch({ type: LOG_OUT, session: null });
  dispatch({ type: SET_USER_SUCCESS, user: null });
  try {
    await fetch('/api/auth/logout', {
      method
    });

    Storage.clear();

    // Previously, we would step outside of react and react-router to
    // force a real request after logout, but that's no longer necessary.
    // location.href = `${location.origin}/login/create-account`;
  } catch (error) {
    void error;
  }
};

export let getPermissions = () => async dispatch => {
  try {
    const res = await (await fetch('/api/roles/permission')).json();

    if (res.error) {
      throw res;
    }
    const { permissions } = res;

    dispatch({ type: GET_PERMISSIONS_SUCCESS, permissions });
    return permissions;
  } catch (error) {
    dispatch({ type: GET_PERMISSIONS_ERROR, error });
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
