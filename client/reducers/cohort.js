import {
  CREATE_COHORT_SUCCESS,
  GET_COHORT_PARTICIPANTS_SUCCESS,
  GET_COHORT_SUCCESS,
  GET_COHORTS_SUCCESS,
  SET_COHORT_SUCCESS,
  SET_COHORT_SCENARIOS_SUCCESS,
  SET_COHORT_USER_ROLE_SUCCESS
} from '../actions/types';

import { cohortInitialState } from './initial-states';

export const cohort = (state = cohortInitialState, action) => {
  const { cohort, type, users, usersById } = action;

  if (
    type === CREATE_COHORT_SUCCESS ||
    type === SET_COHORT_SUCCESS ||
    type === SET_COHORT_SCENARIOS_SUCCESS ||
    type === GET_COHORT_SUCCESS ||
    type === GET_COHORT_PARTICIPANTS_SUCCESS
  ) {
    return {
      ...state,
      ...cohort
    };
  }

  if (type === SET_COHORT_USER_ROLE_SUCCESS) {
    if (users || usersById) {
      return {
        ...state,
        users,
        usersById
      };
    } else {
      return {
        ...state
      };
    }
  }

  return state;
};

export const cohorts = (state = [], action) => {
  const { cohort, cohorts, type } = action;

  switch (type) {
    case GET_COHORTS_SUCCESS: {
      const seen = {
        /*
        cohort.id: index
         */
      };
      return [...state, ...cohorts]
        .reduce((accum, cohort) => {
          // If we've already seen this cohort, then it was already
          // in "state" and we should replace it with the newer version.
          const index = seen[cohort.id];
          if (index !== undefined) {
            accum[index] = cohort;
          } else {
            seen[cohort.id] = accum.length;
            accum.push(cohort);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    }
    case CREATE_COHORT_SUCCESS:
    case SET_COHORT_SUCCESS:
    case GET_COHORT_SUCCESS: {
      if (!cohort || !cohort.id) {
        return [...state];
      }

      const index = state.findIndex(({ id }) => id === cohort.id);

      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...cohort
        };
      } else {
        state.push(cohort);
      }
      return [...state].sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};

export const cohortsById = (state = {}, action) => {
  const { cohort, cohorts, type } = action;

  switch (type) {
    case GET_COHORTS_SUCCESS: {
      const cohortsById = cohorts.reduce((accum, cohort) => {
        accum[cohort.id] = cohort;
        return accum;
      }, {});

      return {
        ...state,
        ...cohortsById
      };
    }
    case CREATE_COHORT_SUCCESS:
    case SET_COHORT_SUCCESS:
    case GET_COHORT_SUCCESS: {
      if (!cohort || !cohort.id) {
        return {
          ...state
        };
      }
      return {
        ...state,
        [cohort.id]: {
          ...(state[cohort.id] || {}),
          ...cohort
        }
      };
    }
    default:
      return state;
  }
};
