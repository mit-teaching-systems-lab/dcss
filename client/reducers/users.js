import { GET_USERS_SUCCESS } from '@client/actions/types';

export const users = (state = [], action) => {
  const { users, type } = action;
  switch (type) {
    case GET_USERS_SUCCESS:
      return [...state, ...users];
    default:
      return state;
  }
};
