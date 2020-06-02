import { LOG_IN, LOG_OUT, SET_USERS } from './types';
import Storage from '@utils/Storage';

export const logIn = userData => ({
  type: LOG_IN,
  payload: {
    ...userData,
    isLoggedIn: true
  }
});

const method = 'POST';

export const logOut = () => async dispatch => {
  const payload = {
    isLoggedIn: false
  };
  dispatch({ type: LOG_OUT, payload });
  try {
    await fetch('/api/auth/logout', {
      method
    });

    Storage.clear();

    // Previously, we would step outside of react and react-router to
    // force a real request after logout.
    // location.href = `${location.origin}/login/create-account`;
  } catch (error) {
    void error;
  }
};

export const setUsers = payload => ({
  type: SET_USERS,
  payload
});
