import {
  // CREATE_COHORT,
  CREATE_COHORT_SUCCESS,
  CREATE_COHORT_ERROR,
  SET_COHORT_SUCCESS,
  SET_COHORT_ERROR,
  // GET_COHORT,
  GET_COHORT_SUCCESS,
  GET_COHORT_ERROR,
  // GET_COHORT_PARTICIPANTS,
  GET_COHORT_PARTICIPANTS_SUCCESS,
  GET_COHORT_PARTICIPANTS_ERROR,
  // GET_COHORT_RUN_DATA_SUCCESS,
  GET_COHORT_RUN_DATA_ERROR,
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
    const res = await (await fetch('/api/cohort', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })).json();

    if (res.error) {
      throw res;
    }
    const { cohort } = res;

    dispatch({ type: CREATE_COHORT_SUCCESS, cohort });
    // return the cohort to the promise action for redirection purposes
    return cohort;
  } catch (error) {
    dispatch({ type: CREATE_COHORT_ERROR, error });
    return null;
  }
};

export const setCohort = cohort => async dispatch => {
  // dispatch({ type: SET_COHORT, cohort });
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
    return null;
  }
};

export const getCohort = id => async dispatch => {
  if (Number.isNaN(id)) {
    return;
  }
  try {
    const res = await (await fetch(`/api/cohort/${id}`)).json();
    if (res.error) {
      throw res;
    }
    const { cohort } = res;
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    // return the cohort to the promise action for redirection purposes
    return cohort;
  } catch (error) {
    dispatch({ type: GET_COHORT_ERROR, error });
    return null;
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
    return null;
  }
};

export const getAllCohorts = () => async dispatch => {
  try {
    const res = await (await fetch('/api/cohort/all')).json();
    if (res.error) {
      throw res;
    }
    const { cohorts } = res;
    dispatch({ type: GET_ALL_COHORTS_SUCCESS, cohorts });
    return cohorts;
  } catch (error) {
    dispatch({ type: GET_ALL_COHORTS_ERROR, error });
    return null;
  }
};

export const getCohortParticipants = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/cohort/${id}`)).json();

    if (res.error) {
      throw res;
    }
    const {
      cohort,
      cohort: { users }
    } = res;
    // Dispatch the entire "cohort", but only the "users" property
    // will be used in the reducer.
    dispatch({ type: GET_COHORT_PARTICIPANTS_SUCCESS, cohort });
    // return the cohort to the promise action for redirection purposes
    return users;
  } catch (error) {
    dispatch({ type: GET_COHORT_PARTICIPANTS_ERROR, error });
    return null;
  }
};

export const getCohortData = (
  cohort_id,
  participant_id,
  scenario_id
) => async dispatch => {
  try {
    const endpoint = scenario_id
      ? `/api/cohort/${cohort_id}/scenario/${scenario_id}`
      : `/api/cohort/${cohort_id}/participant/${participant_id}`;

    const res = await (await fetch(endpoint)).json();

    if (res.error) {
      throw res;
    }

    const { prompts, responses } = res;

    // This dispatch does not update internal state, since
    // such state would be thrown away:
    // dispatch({ type: GET_COHORT_RUN_DATA_SUCCESS, prompts, responses });
    //
    return { prompts, responses };
  } catch (error) {
    dispatch({ type: GET_COHORT_RUN_DATA_ERROR, error });
    return null;
  }
};

export const linkRunToCohort = (cohort_id, run_id) => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/cohort/${cohort_id}/run/${run_id}`
    )).json();
    if (res.error) {
      throw res;
    }
    const { cohort } = res;
    dispatch({ type: LINK_RUN_TO_COHORT_SUCCESS });
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  } catch (error) {
    dispatch({ type: LINK_RUN_TO_COHORT_ERROR, error });
    return null;
  }
};
// This is used to
export const linkUserToCohort = (cohort_id, role) => async dispatch => {
  try {
    const users = await (await fetch(
      `/api/cohort/${cohort_id}/join/${role}`
    )).json();
    if (users.error) {
      throw users;
    }
    dispatch({ type: SET_COHORT_USER_ROLE_SUCCESS, users });
  } catch (error) {
    dispatch({ type: SET_COHORT_USER_ROLE_ERROR, error });
    return null;
  }
};

export const addCohortUserRole = (
  cohort_id,
  user_id,
  role
) => async dispatch => {
  try {
    const body = JSON.stringify({
      cohort_id,
      user_id,
      roles: [role]
    });
    const result = await (await fetch('/api/cohort/${cohort_id}/roles/add', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body
    })).json();

    const { cohort } = result;
    dispatch({ type: SET_COHORT_USER_ROLE_SUCCESS });
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return result;
  } catch (error) {
    dispatch({ type: SET_COHORT_USER_ROLE_ERROR, error });
    return null;
  }
};

export const deleteCohortUserRole = (
  cohort_id,
  user_id,
  role
) => async dispatch => {
  try {
    const body = JSON.stringify({
      cohort_id,
      user_id,
      roles: [role]
    });
    const result = await (await fetch('/api/cohort/${cohort_id}/roles/delete', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body
    })).json();
    const { cohort } = result;
    dispatch({ type: SET_COHORT_USER_ROLE_SUCCESS });
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return result;
  } catch (error) {
    dispatch({ type: SET_COHORT_USER_ROLE_ERROR, error });
    return null;
  }
};
