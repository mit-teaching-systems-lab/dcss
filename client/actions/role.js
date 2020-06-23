import {
  SET_USER_ROLE_SUCCESS,
  SET_USER_ROLE_ERROR
} from './types';

export const addUserRole = (user_id, role) => async dispatch => {
  try {
    const body = JSON.stringify({
      user_id,
      roles: [role]
    });
    const result = await (
      await fetch('/api/roles/add', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      })
    ).json();
    dispatch({ type: SET_USER_ROLE_SUCCESS });
    return result;
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
    const result = await (
      await fetch('/api/roles/delete', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      })
    ).json();
    dispatch({ type: SET_USER_ROLE_SUCCESS });
    return result;
  } catch (error) {
    dispatch({ type: SET_USER_ROLE_ERROR, error });
    return null;
  }
};
