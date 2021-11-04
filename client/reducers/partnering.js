import { GET_PARTNERING_SUCCESS } from '@actions/types';

export const partnering = (state = [], action) => {
  const { partnering = [], type } = action;
  switch (type) {
    case GET_PARTNERING_SUCCESS:
      return partnering;
    default:
      return state;
  }
};

export const partneringById = (state = {}, action) => {
  const { partnering = [], type } = action;
  switch (type) {
    case GET_PARTNERING_SUCCESS: {
      const partnerById = partnering.reduce(
        (accum, partner) => ({
          ...accum,
          [partner.id]: partner
        }),
        {}
      );
      return {
        ...state,
        ...partnerById
      };
    }
    default:
      return state;
  }
};
