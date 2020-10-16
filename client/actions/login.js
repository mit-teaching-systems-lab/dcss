import { LOG_IN, LOG_OUT, SET_USER_SUCCESS } from './types';
import Storage from '@utils/Storage';

export let logIn = login => async dispatch => {
  dispatch({
    type: LOG_IN,
    login: {
      ...login,
      isLoggedIn: true
    }
  });
};

const method = 'POST';

export let logOut = () => async dispatch => {
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
