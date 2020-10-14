import { SET_USER_ROLE_SUCCESS, SET_USER_ROLE_ERROR } from './types';

export const addUserRole = (user_id, role) => async dispatch => {
  try {
    const body = JSON.stringify({
      user_id,
      roles: [role]
    });
    const res = await (
      await fetch('/api/roles/add', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      })
    ).json();

    if (res.error) {
      throw res;
    }

    dispatch({ type: SET_USER_ROLE_SUCCESS });
    return res;
  } catch (error) {
    dispatch({ type: SET_USER_ROLE_ERROR, error });
    return null;
  }
};

export const deleteUserRole = (user_id, role) => async dispatch => {
  try {
    const body = JSON.stringify({
      user_id,
      roles: [role]
    });
    const res = await (
      await fetch('/api/roles/delete', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      })
    ).json();

    if (res.error) {
      throw res;
    }

    dispatch({ type: SET_USER_ROLE_SUCCESS });
    return res;
  } catch (error) {
    dispatch({ type: SET_USER_ROLE_ERROR, error });
    return null;
  }
};
