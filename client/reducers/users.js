import { GET_USERS_SUCCESS } from '@actions/types';

export const users = (state = [], action) => {
  const { users, type } = action;
  switch (type) {
    case GET_USERS_SUCCESS:
      return [...state, ...users];
    default:
      return state;
  }
};

export const usersById = (state = {}, action) => {
  const { users, type } = action;
  switch (type) {
    case GET_USERS_SUCCESS: {
      const usersById = users.reduce((accum, user) => {
        accum[user.id] = user;
        return accum;
      }, {});
      return {
        ...state,
        ...usersById
      };
    }
    default:
      return state;
  }
};
