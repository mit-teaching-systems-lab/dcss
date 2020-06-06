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
