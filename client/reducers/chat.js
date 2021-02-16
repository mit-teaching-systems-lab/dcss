import {
  GET_CHAT_SUCCESS,
  GET_CHAT_USERS_SUCCESS,
  GET_CHATS_SUCCESS,
  SET_CHAT_USERS_SUCCESS,
  LINK_RUN_TO_CHAT_SUCCESS
} from '@actions/types';

import { chatInitialState } from './initial-states';

export const chat = (state = chatInitialState, action) => {
  const { chat, users, type } = action;

  switch (type) {
    case SET_CHAT_USERS_SUCCESS:
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
    case LINK_RUN_TO_CHAT_SUCCESS: {
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
  const { chat, chats, type } = action;

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
    case GET_CHAT_SUCCESS:
    case LINK_RUN_TO_CHAT_SUCCESS: {
      if (!chat || !chat.id) {
        return [...state];
      }

      const index = state.findIndex(({ id }) => id === chat.id);

      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...chat
        };
      } else {
        state.push(chat);
      }
      return [...state].sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};

export const chatsById = (state = {}, action) => {
  const { chat, chats, type } = action;

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
    case GET_CHAT_SUCCESS:
    case LINK_RUN_TO_CHAT_SUCCESS: {
      if (!chat || !chat.id) {
        return {
          ...state
        };
      }
      return {
        ...state,
        [chat.id]: {
          ...(state[chat.id] || {}),
          ...chat
        }
      };
    }
    default:
      return state;
  }
};
