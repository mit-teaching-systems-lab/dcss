import {
  GET_RUN_SUCCESS,
  GET_RUNS_SUCCESS,
  SET_RUN_SUCCESS
} from '@actions/types';

const initialState = {};

export const run = (state = initialState, action) => {
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
      return runs;
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
          accum[run.run_id] = run;
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
          [run.run_id]: run
        };
      }
      return state;
    }
    default:
      return state;
  }
};
