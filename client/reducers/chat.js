import {
  GET_CHAT_SUCCESS,
  GET_CHAT_USERS_SUCCESS,
  GET_CHATS_SUCCESS,
  LINK_CHAT_TO_RUN_SUCCESS
} from '@actions/types';

import { chatInitialState } from './initial-states';

export const chat = (state = chatInitialState, action) => {
  const { chat, users, type } = action;

  switch (type) {
    case GET_CHAT_USERS_SUCCESS: {
      const usersById = users.reduce((accum, user) => {
        accum[user.id] = user;
        return accum;
      }, {});
      return {
        ...state,
        users,
        usersById
      };
    }
    case GET_CHAT_SUCCESS:
    case LINK_CHAT_TO_RUN_SUCCESS: {
      return {
        ...state,
        ...chat
      };
    }
    default:
      return state;
  }
};

export const chats = (state = [], action) => {
  const { chats, type } = action;

  switch (type) {
    case GET_CHATS_SUCCESS: {
      const seen = {
        /*
        chats.id: index
         */
      };
      return [...state, ...chats]
        .reduce((accum, chats) => {
          // If we've already seen this then it was already
          // in "state" and we should replace it with the newer version.
          const index = seen[chats.id];
          if (index !== undefined) {
            accum[index] = chats;
          } else {
            seen[chats.id] = accum.length;
            accum.push(chats);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};

export const chatsById = (state = {}, action) => {
  const { chats, type } = action;

  switch (type) {
    case GET_CHATS_SUCCESS: {
      const chatsById = chats.reduce((accum, chats) => {
        accum[chats.id] = chats;
        return accum;
      }, {});
      return {
        ...state,
        ...chatsById
      };
    }
    default:
      return state;
  }
};
