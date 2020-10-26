import { GET_TRACES_SUCCESS } from '@actions/types';

export const traces = (state = [], action) => {
  const { traces, type } = action;

  switch (type) {
    case GET_TRACES_SUCCESS: {
      const seen = {
        /*
        trace.id: index
         */
      };
      return [...state, ...traces]
        .reduce((accum, trace) => {
          // If we've already seen this then it was already
          // in "state" and we should replace it with the newer version.
          const index = seen[trace.id];
          if (index !== undefined) {
            accum[index] = trace;
          } else {
            seen[trace.id] = accum.length;
            accum.push(trace);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};

export const tracesById = (state = {}, action) => {
  const { traces, type } = action;

  switch (type) {
    case GET_TRACES_SUCCESS: {
      const tracesById = traces.reduce((accum, trace) => {
        accum[trace.id] = trace;
        return accum;
      }, {});
      return {
        ...state,
        ...tracesById
      };
    }
    default:
      return state;
  }
};
