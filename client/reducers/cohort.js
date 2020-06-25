import {
  CREATE_COHORT_SUCCESS,
  GET_COHORT_PARTICIPANTS_SUCCESS,
  GET_COHORT_SUCCESS,
  GET_ALL_COHORTS_SUCCESS,
  GET_USER_COHORTS_SUCCESS,
  SET_COHORT_SUCCESS,
  SET_COHORT_USER_ROLE_SUCCESS
} from '../actions/types';

const cohortInitialState = {
  id: null,
  created_at: '',
  name: '',
  runs: [],
  scenarios: [],
  users: []
};

export const cohort = (state = cohortInitialState, action) => {
  const { type, cohort, users } = action;

  if (type === SET_COHORT_SUCCESS || type === GET_COHORT_SUCCESS) {
    return {
      ...state,
      ...cohort
    };
  }

  if (type === CREATE_COHORT_SUCCESS) {
    // console.log('CREATED: ', { ...cohort });
    return {
      ...state,
      ...cohort,
      role: 'owner'
    };
  }

  if (type === GET_COHORT_PARTICIPANTS_SUCCESS) {
    return {
      ...state,
      users: cohort.users
    };
  }

  if (type === SET_COHORT_USER_ROLE_SUCCESS) {
    if (users) {
      return {
        ...state,
        users
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
  const { type, cohorts } = action;
  if (type === GET_USER_COHORTS_SUCCESS || type === GET_ALL_COHORTS_SUCCESS) {
    return cohorts.slice();
  }

  return state;
};

export const cohortsById = (state = {}, action) => {
  const { type, cohorts } = action;

  if (type === GET_USER_COHORTS_SUCCESS || type === GET_ALL_COHORTS_SUCCESS) {
    return cohorts.reduce((accum, cohort) => {
      accum[cohort.id] = cohort;
      return accum;
    }, {});
  }

  return state;
};
