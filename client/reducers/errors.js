import { combineReducers } from 'redux';

import {
  DELETE_SCENARIO_ERROR,
  UNLOCK_SCENARIO_ERROR,
  GET_ALL_COHORTS_ERROR,
  GET_COHORT_ERROR,
  GET_COHORT_RUN_DATA_ERROR,
  GET_RESPONSE_ERROR,
  GET_RUN_ERROR,
  GET_RUNS_ERROR,
  GET_SCENARIO_ERROR,
  GET_SCENARIOS_ERROR,
  GET_SLIDES_ERROR,
  GET_TRANSCRIPT_ERROR,
  GET_USER_COHORTS_ERROR,
  GET_USER_ERROR,
  GET_USERS_ERROR,
  LINK_RUN_TO_COHORT_ERROR,
  SET_COHORT_ERROR,
  SET_RESPONSE_ERROR,
  SET_RUN_ERROR,
  SET_SCENARIO_ERROR,
  SET_SCENARIOS_ERROR,
  SET_USER_ERROR
} from '@actions/types';

// eslint-disable-next-line no-unused-vars
const cohort = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case GET_COHORT_ERROR:
    case SET_COHORT_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const cohorts = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case GET_ALL_COHORTS_ERROR:
    case GET_USER_COHORTS_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const cohortdata = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case GET_COHORT_RUN_DATA_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const cohortlink = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case LINK_RUN_TO_COHORT_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const scenario = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case DELETE_SCENARIO_ERROR:
    case UNLOCK_SCENARIO_ERROR:
    case GET_SCENARIO_ERROR:
    case SET_SCENARIO_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const scenarios = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case GET_SCENARIOS_ERROR:
    case SET_SCENARIOS_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const slides = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case GET_SLIDES_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const response = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case SET_RESPONSE_ERROR:
    case GET_RESPONSE_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const transcript = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case GET_TRANSCRIPT_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const run = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case SET_RUN_ERROR:
    case GET_RUN_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const runs = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case GET_RUNS_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const user = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case GET_USER_ERROR:
    case SET_USER_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
const users = (state = null, action) => {
  const { error = {}, type } = action;
  switch (type) {
    case GET_USERS_ERROR:
      return {
        ...error
      };
    default:
      return null;
  }
};

export default combineReducers({
  cohort,
  cohortdata,
  cohortlink,
  cohorts,
  response,
  run,
  runs,
  scenario,
  scenarios,
  slides,
  transcript,
  user,
  users
});
