import {
  CREATE_COHORT_SUCCESS,
  GET_COHORT_PARTICIPANTS_SUCCESS,
  GET_COHORT_SUCCESS,
  GET_ALL_COHORTS_SUCCESS,
  GET_USER_COHORTS_SUCCESS,
  SET_COHORT_SUCCESS,
  SET_COHORT_USER_ROLE_SUCCESS
} from '../actions/types';

import { cohortInitialState } from './initial-states';

export const cohort = (state = cohortInitialState, action) => {
  const { cohort, type, users, usersById } = action;

  if (
    type === CREATE_COHORT_SUCCESS ||
    type === SET_COHORT_SUCCESS ||
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
  const { cohorts, type } = action;
  if (type === GET_USER_COHORTS_SUCCESS || type === GET_ALL_COHORTS_SUCCESS) {
    return cohorts.slice();
  }

  return state;
};

export const cohortsById = (state = {}, action) => {
  const { cohorts, type } = action;

  if (type === GET_USER_COHORTS_SUCCESS || type === GET_ALL_COHORTS_SUCCESS) {
    return cohorts.reduce((accum, cohort) => {
      accum[cohort.id] = cohort;
      return accum;
    }, {});
  }

  return state;
};
