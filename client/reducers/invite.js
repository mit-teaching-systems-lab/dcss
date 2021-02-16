import { GET_INVITES_SUCCESS, SET_INVITE_SUCCESS } from '@actions/types';

import { inviteInitialState } from './initial-states';

export const invites = (state = [], action) => {
  const { invite, invites, type } = action;

  switch (type) {
    case GET_INVITES_SUCCESS: {
      const seen = {
        /*
        invites.id: index
         */
      };
      return [...state, ...invites]
        .reduce((accum, invites) => {
          // If we've already seen this then it was already
          // in "state" and we should replace it with the newer version.
          const index = seen[invites.id];
          if (index !== undefined) {
            accum[index] = invites;
          } else {
            seen[invites.id] = accum.length;
            accum.push(invites);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    }
    case SET_INVITE_SUCCESS: {
      if (!invite || !invite.id) {
        return [...state];
      }

      const index = state.findIndex(({ id }) => id === invite.id);

      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...invite
        };
      } else {
        state.push(invite);
      }
      return [...state].sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};

export const invitesById = (state = {}, action) => {
  const { invite, invites, type } = action;

  switch (type) {
    case GET_INVITES_SUCCESS: {
      const invitesById = invites.reduce((accum, invites) => {
        accum[invites.id] = invites;
        return accum;
      }, {});
      return {
        ...state,
        ...invitesById
      };
    }
    case SET_INVITE_SUCCESS: {
      if (!invite || !invite.id) {
        return {
          ...state
        };
      }
      return {
        ...state,
        [invite.id]: {
          ...(state[invite.id] || {}),
          ...invite
        }
      };
    }
    default:
      return state;
  }
};
