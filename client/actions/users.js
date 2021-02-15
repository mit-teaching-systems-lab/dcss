import {
  GET_USERS_BY_PERMISSION_ERROR,
  GET_USERS_BY_PERMISSION_SUCCESS,
  GET_USERS_COUNT_ERROR,
  GET_USERS_COUNT_SUCCESS,
  GET_USERS_ERROR,
  GET_USERS_SUCCESS
} from './types';

export let setUsers = users => async dispatch => {
  dispatch({
    type: GET_USERS_SUCCESS,
    users
  });
};

export let getUsers = (limit = 'all') => async dispatch => {
  /*
    limit = "all" | "available"
  */
  try {
    const res = await (await fetch(`/api/roles/${limit}`)).json();

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

export let getUsersCount = (limit = 'all') => async dispatch => {
  /*
    limit = "all" | "available"
  */
  try {
    const res = await (await fetch(`/api/roles/${limit}/count`)).json();

    if (res.error) {
      throw res;
    }
    const count = Number(res.count);

    dispatch({ type: GET_USERS_COUNT_SUCCESS, count });
    return count;
  } catch (error) {
    dispatch({ type: GET_USERS_COUNT_ERROR, error });
    return null;
  }
};

/**
 * getUsersByPermission dispatch is not used by any reducer, because the returned values do not
 * need to be stored in memory.
 * @param  {string} permission The permission to filter users on.
 * @return {array}             An array of users that have this permission.
 */
export let getUsersByPermission = permission => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/roles/user/permission/${permission}`
    )).json();
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
