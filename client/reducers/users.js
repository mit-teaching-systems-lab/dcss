import { GET_USERS_SUCCESS } from '@actions/types';

export const users = (state = [], action) => {
  const { users, type } = action;
  switch (type) {
    case GET_USERS_SUCCESS:
      const seen = {
        /*
        user.id: index
         */
      };
      return [...state, ...users]
        .reduce((accum, user) => {
          // If we've already seen this user, then it was already
          // in "state" and we should replace it with the newer version.
          const index = seen[user.id];
          if (index !== undefined) {
            accum[index] = user;
          } else {
            seen[user.id] = accum.length;
            accum.push(user);
          }
          return accum;
        }, [])
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
