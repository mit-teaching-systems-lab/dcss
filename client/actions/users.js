import {
  GET_USERS_SUCCESS,
  GET_USERS_ERROR,
  GET_USERS_BY_PERMISSION_SUCCESS,
  GET_USERS_BY_PERMISSION_ERROR
} from './types';

// Previously...
// export const setUsers = users => ({
//   type: GET_USERS_SUCCESS,
//   users
// });

export const setUsers = users => async dispatch => {
  dispatch({
    type: GET_USERS_SUCCESS,
    users
  });
};

export const getUsers = () => async dispatch => {
  try {
    const res = await (await fetch('/api/roles/all')).json();

    if (res.error) {
      throw res;
    }

    const { users = [] } = res;
    dispatch({ type: GET_USERS_SUCCESS, users });
    return users;
  } catch (error) {
    dispatch({ type: GET_USERS_ERROR, error });
    return null;
  }
};

/**
 * getUsersByPermission dispatch is not used by any reducer, because the returned values do not
 * need to be stored in memory.
 * @param  {string} permission The permission to filter users on.
 * @return {array}             An array of users that have this permission.
 */
export const getUsersByPermission = permission => async dispatch => {
  try {
    const res = await (
      await fetch(`/api/roles/user/permission/${permission}`)
    ).json();
    if (res.error) {
      throw res;
    }
    const { users } = res;

    void GET_USERS_BY_PERMISSION_SUCCESS;

    return users;
  } catch (error) {
    dispatch({ type: GET_USERS_BY_PERMISSION_ERROR, error });
    return null;
  }
};
