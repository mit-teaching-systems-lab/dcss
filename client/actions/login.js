import Crypto from 'crypto-js';
import { LOG_IN, LOG_OUT, SET_USER_SUCCESS } from './types';
import Storage from '@utils/Storage';

export const setIsLoggedIn = login => async dispatch => {
  dispatch({
    type: LOG_IN,
    login: {
      ...login,
      isLoggedIn: true
    }
  });
};

const method = 'POST';

export const logIn = (params) => async dispatch => {
  try {
    let { username, password } = params;

    username = username.trim();
    password = Crypto.AES.encrypt(password, SESSION_SECRET).toString();

    const body = JSON.stringify({
      username,
      password
    });

    const { error = '', message = '' } = await (
      await fetch('/api/auth/login', {
        headers: {
          'Content-Type': 'application/json'
        },
        method,
        body
      })
    ).json();

    return { error, message };
    // Previously, we would step outside of react and react-router to
    // force a real request after logout, but that's no longer necessary.
    // location.href = `${location.origin}/login/create-account`;
  } catch (error) {
    return {
      error, message: error.message
    };
  }
};

export const logOut = () => async dispatch => {
  dispatch({ type: LOG_OUT, login: null });
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
