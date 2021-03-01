import { GET_INTERACTIONS_SUCCESS } from '@actions/types';

export const interactions = (state = [], action) => {
  const { interactions, type } = action;
  switch (type) {
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
  const { interactions, type } = action;
  switch (type) {
    case GET_INTERACTIONS_SUCCESS: {
      const interactionsById = interactions.reduce((accum, interaction) => {
        accum[interaction.id] = interaction;
        return accum;
      }, {});
      return {
        ...state,
        ...interactionsById
      };
    }
    default:
      return state;
  }
};
