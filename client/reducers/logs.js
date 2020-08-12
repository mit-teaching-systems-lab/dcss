import { GET_LOGS_SUCCESS } from '@actions/types';

export const logs = (state = [], action) => {
  const { logs, type } = action;

  switch (type) {
    case GET_LOGS_SUCCESS: {
      const seen = {
        /*
        log.id: index
         */
      };
      return [...state, ...logs]
        .reduce((accum, log) => {
          // If we've already seen this then it was already
          // in "state" and we should replace it with the newer version.
          const index = seen[log.id];
          if (index !== undefined) {
            accum[index] = log;
          } else {
            seen[log.id] = accum.length;
            accum.push(log);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};

export const logsById = (state = {}, action) => {
  const { logs, type } = action;

  switch (type) {
    case GET_LOGS_SUCCESS: {
      const logsById = logs.reduce((accum, log) => {
        accum[log.id] = log;
        return accum;
      }, {});
      return {
        ...state,
        ...logsById
      };
    }
    default:
      return state;
  }
};
