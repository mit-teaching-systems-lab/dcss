import { GET_USERS_SUCCESS, GET_USERS_ERROR } from './types';

export const setUsers = users => ({
  type: GET_USERS_SUCCESS,
  users
});

export const getUsers = () => async dispatch => {
  try {
    const { users } = await (await fetch('/api/roles/all')).json();
    dispatch({ type: GET_USERS_SUCCESS, users });
    return users;
  } catch (error) {
    dispatch({ type: GET_USERS_ERROR, error });
    return error;
  }
};

/**
 * getUsersByPermission does not dispatch because it's called on a scenario specific basis.
 * @param  {string} permission The permission to filter users on.
 * @return {array}             An array of users that have this permission.
 */
export const getUsersByPermission = (permission) => async () => {
  try {
    const authors = await (await fetch('/api/roles/user/permission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ permission })
    })).json();
    return authors;
  } catch (error) {
    return error;
  }
};

