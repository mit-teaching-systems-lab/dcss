import {
  // CREATE_COHORT,
  CREATE_COHORT_SUCCESS,
  CREATE_COHORT_ERROR,
  SET_COHORT,
  SET_COHORT_SUCCESS,
  SET_COHORT_ERROR,
  // GET_COHORT,
  GET_COHORT_SUCCESS,
  GET_COHORT_ERROR,
  // GET_COHORT_PARTICIPANTS,
  GET_COHORT_PARTICIPANTS_SUCCESS,
  GET_COHORT_PARTICIPANTS_ERROR,
  GET_COHORT_DATA_SUCCESS,
  GET_COHORT_DATA_ERROR,
  // GET_ALL_COHORTS,
  GET_ALL_COHORTS_SUCCESS,
  GET_ALL_COHORTS_ERROR,
  // GET_USER_COHORTS,
  GET_USER_COHORTS_SUCCESS,
  GET_USER_COHORTS_ERROR,
  // LINK_COHORT_TO_RUN,
  LINK_RUN_TO_COHORT_SUCCESS,
  LINK_RUN_TO_COHORT_ERROR,
  // SET_COHORT_USER_ROLE,
  SET_COHORT_USER_ROLE_SUCCESS,
  SET_COHORT_USER_ROLE_ERROR
} from './types';

export const createCohort = ({ name }) => async dispatch => {
  try {
    const res = await fetch('/api/cohort', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const response = await res.json();
    if (response.error) {
      throw response;
    }
    const { cohort } = response;

    dispatch({ type: CREATE_COHORT_SUCCESS, cohort });
    // return the cohort to the promise action for redirection purposes
    return cohort;
  } catch (error) {
    dispatch({ type: CREATE_COHORT_ERROR, error });
    // pass along the error to the promise action
    throw error;
  }
};

export const setCohort = cohort => async dispatch => {
  dispatch({ type: SET_COHORT, cohort });
  try {
    const { scenarios } = cohort;
    const body = JSON.stringify({
      scenarios
    });
    await (await fetch(`/api/cohort/${cohort.id}/scenarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })).json();
    dispatch({ type: SET_COHORT_SUCCESS, cohort });
  } catch (error) {
    dispatch({ type: SET_COHORT_ERROR, error });
  }
};

export const getCohort = id => async dispatch => {
  if (Number.isNaN(id)) {
    return;
  }
  try {
    const response = await (await fetch(`/api/cohort/${id}`)).json();
    if (response.error) {
      throw response;
    }
    const { cohort } = response;
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    // return the cohort to the promise action for redirection purposes
    return cohort;
  } catch (error) {
    dispatch({ type: GET_COHORT_ERROR, error });
    // pass along the error to the promise action
    throw error;
  }
};

export const getCohorts = () => async dispatch => {
  try {
    const response = await (await fetch('/api/cohort/my')).json();

    if (response.error) {
      throw response;
    }
    const { cohorts } = response;
    dispatch({ type: GET_USER_COHORTS_SUCCESS, cohorts });
  } catch (error) {
    dispatch({ type: GET_USER_COHORTS_ERROR, error });
  }
};

export const getAllCohorts = () => async dispatch => {
  try {
    const response = await (await fetch('/api/cohort/all')).json();
    if (response.error) {
      throw response;
    }
    const { cohorts } = response;
    dispatch({ type: GET_ALL_COHORTS_SUCCESS, cohorts });
    return cohorts;
  } catch (error) {
    dispatch({ type: GET_ALL_COHORTS_ERROR, error });
  }
};

export const setCohortUserRole = ({ id, role }) => async dispatch => {
  try {
    const users = await (await fetch(`/api/cohort/${id}/join/${role}`)).json();
    if (users.error) {
      throw users;
    }
    dispatch({ type: SET_COHORT_USER_ROLE_SUCCESS, users });
  } catch (error) {
    dispatch({ type: SET_COHORT_USER_ROLE_ERROR, error });
  }
};

export const getCohortParticipants = id => async dispatch => {
  try {
    const response = await (await fetch(`/api/cohort/${id}`)).json();

    if (response.error) {
      throw response;
    }
    const {
      cohort,
      cohort: { users }
    } = response;
    // Dispatch the entire "cohort", but only the "users" property
    // will be used in the reducer.
    dispatch({ type: GET_COHORT_PARTICIPANTS_SUCCESS, cohort });
    // return the cohort to the promise action for redirection purposes
    return users;
  } catch (error) {
    dispatch({
      type: GET_COHORT_PARTICIPANTS_ERROR,
      error
    });
    // pass along the error to the promise action
    throw error;
  }
};

export const getCohortData = params => async dispatch => {
  const { cohortId, participantId, scenarioId } = params;
  try {
    const endpoint = scenarioId
      ? `/api/cohort/${cohortId}/scenario/${scenarioId}`
      : `/api/cohort/${cohortId}/participant/${participantId}`;

    const response = await (await fetch(endpoint)).json();

    if (response.error) {
      throw response;
    }

    const { prompts, responses } = response;

    dispatch({ type: GET_COHORT_DATA_SUCCESS, prompts, responses });
    return { prompts, responses };
  } catch (error) {
    dispatch({
      type: GET_COHORT_DATA_ERROR,
      error
    });
    // pass along the error to the promise action
    throw error;
  }
};

export const linkRunToCohort = (cohortId, runId) => async dispatch => {
  try {
    const response = await (await fetch(
      `/api/cohort/${cohortId}/run/${runId}`
    )).json();
    if (response.error) {
      throw response;
    }
    const { cohort } = response;
    dispatch({ type: LINK_RUN_TO_COHORT_SUCCESS });
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  } catch (error) {
    dispatch({ type: LINK_RUN_TO_COHORT_ERROR, error });
  }
};
