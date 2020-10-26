import {
  GET_RUN_SUCCESS,
  GET_RUNS_SUCCESS,
  SET_RUN_SUCCESS
} from '@actions/types';

import { runInitialState } from './initial-states';

export const run = (state = runInitialState, action) => {
  const { run, type } = action;

  switch (type) {
    case GET_RUN_SUCCESS:
    case SET_RUN_SUCCESS:
      return {
        ...state,
        ...run
      };
    default:
      return state;
  }
};

export const runs = (state = [], action) => {
  const { runs, type } = action;

  switch (type) {
    case GET_RUNS_SUCCESS:
      const seen = {
        /*
        run.id: index
         */
      };
      return [...state, ...runs]
        .reduce((accum, run) => {
          // If we've already seen this run, then it was already
          // in "state" and we should replace it with the newer version.
          const index = seen[run.id];
          if (index !== undefined) {
            accum[index] = run;
          } else {
            seen[run.id] = accum.length;
            accum.push(run);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    default:
      return state;
  }
};

export const runsById = (state = {}, action) => {
  const { run, runs, type } = action;

  switch (type) {
    case GET_RUN_SUCCESS:
    case SET_RUN_SUCCESS:
    case GET_RUNS_SUCCESS: {
      if (typeof runs !== 'undefined') {
        const runsById = runs.reduce((accum, run) => {
          accum[run.id || run.run_id] = run;
          return accum;
        }, {});

        return {
          ...state,
          ...runsById
        };
      }

      if (typeof run !== 'undefined') {
        return {
          ...state,
          [run.id || run.run_id]: run
        };
      }
      return state;
    }
    default:
      return state;
  }
};
