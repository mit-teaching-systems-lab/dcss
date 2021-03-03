import {
  GET_INTERACTION_SUCCESS,
  SET_INTERACTION_SUCCESS,
  GET_INTERACTIONS_SUCCESS
} from '@actions/types';
import { interactionInitialState } from './initial-states';

export const interaction = (state = interactionInitialState, action) => {
  const { interaction, type } = action;
  switch (type) {
    case GET_INTERACTION_SUCCESS:
    case SET_INTERACTION_SUCCESS: {
      return {
        ...state,
        ...interaction
      };
    }
    default:
      return state;
  }
};

export const interactions = (state = [], action) => {
  const { interaction, interactions, type } = action;
  switch (type) {
    case GET_INTERACTION_SUCCESS:
    case SET_INTERACTION_SUCCESS: {
      const index = state.findIndex(({ id }) => id === interaction.id);
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...interaction
        };
      } else {
        state.push(interaction);
      }
      return [...state].sort((a, b) => a.id < b.id);
    }
    case GET_INTERACTIONS_SUCCESS: {
      const seen = {
        /*
        interaction.id: index
         */
      };
      return [...state, ...interactions]
        .reduce((accum, interaction) => {
          // If we've already seen this interaction, then it was already
          // in "state" and we should replace it with the newer version.
          const index = seen[interaction.id];
          if (index !== undefined) {
            accum[index] = interaction;
          } else {
            seen[interaction.id] = accum.length;
            accum.push(interaction);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};

export const interactionsById = (state = {}, action) => {
  const { interaction, interactions, type } = action;
  switch (type) {
    case GET_INTERACTION_SUCCESS:
    case SET_INTERACTION_SUCCESS: {
      return {
        ...state,
        [interaction.id]: {
          ...interaction
        }
      };
    }
    case GET_INTERACTIONS_SUCCESS: {
      const interactionsById = interactions.reduce(
        (accum, interaction) => ({
          ...accum,
          [interaction.id]: interaction
        }),
        {}
      );
      return {
        ...state,
        ...interactionsById
      };
    }
    default:
      return state;
  }
};
