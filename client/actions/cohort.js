import {
  CREATE_COHORT_ERROR,
  CREATE_COHORT_SUCCESS,
  GET_COHORT_CHATS_OVERVIEW_ERROR,
  GET_COHORT_CHATS_OVERVIEW_SUCCESS,
  GET_COHORT_ERROR,
  GET_COHORT_PARTICIPANTS_ERROR,
  GET_COHORT_PARTICIPANTS_SUCCESS,
  GET_COHORT_RUN_DATA_ERROR,
  GET_COHORT_SCENARIOS_ERROR,
  GET_COHORT_SCENARIOS_SUCCESS,
  GET_COHORT_SUCCESS,
  GET_COHORTS_COUNT_ERROR,
  GET_COHORTS_COUNT_SUCCESS,
  GET_COHORTS_ERROR,
  GET_COHORTS_SUCCESS,
  LINK_RUN_TO_COHORT_ERROR,
  LINK_RUN_TO_COHORT_SUCCESS,
  SET_COHORT_ERROR,
  SET_COHORT_SCENARIOS_ERROR,
  SET_COHORT_SCENARIOS_SUCCESS,
  SET_COHORT_SCENARIO_PARTNERING_ERROR,
  SET_COHORT_SCENARIO_PARTNERING_SUCCESS,
  SET_COHORT_SUCCESS,
  SET_COHORT_USER_ROLE_ERROR,
  SET_COHORT_USER_ROLE_SUCCESS
} from './types';
import store from '@client/store';
import { cohortInitialState } from '@reducers/initial-states';

export let createCohort = ({ name }) => async dispatch => {
  try {
    const res = await (await fetch('/api/cohorts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })).json();

    if (res.error) {
      throw res;
    }

    const cohort = {
      ...cohortInitialState,
      ...res.cohort,
      role: 'owner'
    };

    dispatch({ type: CREATE_COHORT_SUCCESS, cohort });
    // return the cohort to the promise action for redirection purposes
    return cohort;
  } catch (error) {
    dispatch({ type: CREATE_COHORT_ERROR, error });
    return null;
  }
};

export let getCohortScenarios = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/cohorts/${id}/scenarios`)).json();

    if (res.error) {
      throw res;
    }

    const { scenarios } = res;

    dispatch({ type: GET_COHORT_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  } catch (error) {
    dispatch({ type: GET_COHORT_SCENARIOS_ERROR, error });
    return null;
  }
};

export let setCohortScenarios = cohort => async dispatch => {
  // Update the local cohort data immediately to ensure that
  // no "flicker" occurs as a result of network latency.
  dispatch({ type: SET_COHORT_SCENARIOS_SUCCESS, cohort });

  try {
    const { scenarios } = cohort;
    const body = JSON.stringify({
      scenarios
    });
    const res = await (await fetch(`/api/cohorts/${cohort.id}/scenarios`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })).json();

    if (res.error) {
      throw res;
    }

    dispatch({ type: SET_COHORT_SCENARIOS_SUCCESS, cohort });
    return cohort;
  } catch (error) {
    dispatch({ type: SET_COHORT_SCENARIOS_ERROR, error });
    return null;
  }
};

export let setCohortScenarioPartnering = cohort => async dispatch => {
  try {
    const partnering = [];

    for (const [scenario_id, partnering_id] of Object.entries(
      cohort.partnering
    )) {
      partnering.push({ scenario_id, partnering_id });
    }

    const body = JSON.stringify({
      partnering
    });
    const res = await (await fetch(`/api/cohorts/${cohort.id}/partnering`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })).json();

    if (res.error) {
      throw res;
    }

    dispatch({ type: SET_COHORT_SCENARIO_PARTNERING_SUCCESS, partnering });
    return partnering;
  } catch (error) {
    dispatch({ type: SET_COHORT_SCENARIO_PARTNERING_ERROR, error });
    return null;
  }
};

export let setCohort = (id, params) => async dispatch => {
  try {
    const { name, deleted_at = null, is_archived } = params;
    const updates = {};

    if (name) {
      updates.name = name;
    }

    // When restoring a cohort, deleted_at will be set to null.
    if (deleted_at !== undefined) {
      updates.deleted_at = deleted_at;
    }

    if (is_archived) {
      updates.is_archived = is_archived;
    }

    const body = JSON.stringify(updates);
    const res = await (await fetch(`/api/cohorts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })).json();

    if (res.error) {
      throw res;
    }

    const { cohort } = res;

    dispatch({ type: SET_COHORT_SUCCESS, cohort });
    return cohort;
  } catch (error) {
    dispatch({ type: SET_COHORT_ERROR, error });
    return null;
  }
};

export let getCohort = id => async dispatch => {
  if (Number.isNaN(id)) {
    return;
  }
  try {
    const res = await (await fetch(`/api/cohorts/${id}`)).json();
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

export let getCohortChatsOverview = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/cohorts/${id}/overview`)).json();
    if (res.error) {
      throw res;
    }
    const { chats } = res;
    dispatch({ type: GET_COHORT_CHATS_OVERVIEW_SUCCESS, chats });
    return chats;
  } catch (error) {
    dispatch({ type: GET_COHORT_CHATS_OVERVIEW_ERROR, error });
    return null;
  }
};

export let copyCohort = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/cohorts/${id}/copy`)).json();
    if (res.error) {
      throw res;
    }

    const cohort = {
      ...cohortInitialState,
      ...res.cohort,
      role: 'owner'
    };

    dispatch({ type: CREATE_COHORT_SUCCESS, cohort });
    return cohort;
  } catch (error) {
    dispatch({ type: CREATE_COHORT_ERROR, error });
    return null;
  }
};

export let getCohortsCount = () => async dispatch => {
  try {
    const res = await (await fetch('/api/cohorts/count')).json();
    if (res.error) {
      throw res;
    }
    const count = Number(res.count);

    dispatch({ type: GET_COHORTS_COUNT_SUCCESS, count });
    return count;
  } catch (error) {
    dispatch({ type: GET_COHORTS_COUNT_ERROR, error });
    return null;
  }
};

export let getCohortsSlice = (
  direction = 'DESC',
  offset = 0,
  limit = 30
) => async (dispatch, getState) => {
  const state = getState();
  const count = await store.dispatch(getCohortsCount());
  if (state.session.isLoggedIn && count === state.cohorts.length) {
    const { cohorts } = state;
    dispatch({ type: GET_COHORTS_SUCCESS, cohorts });
    return cohorts;
  }

  try {
    const url = `/api/cohorts/slice/${direction}/${offset}/${limit}`;
    const res = await (await fetch(url)).json();

    if (res.error) {
      throw res;
    }
    const { cohorts = [] } = res;

    dispatch({ type: GET_COHORTS_SUCCESS, cohorts });
    return cohorts;
  } catch (error) {
    dispatch({ type: GET_COHORTS_ERROR, error });
    return null;
  }
};

export let getCohorts = () => async (dispatch, getState) => {
  const state = getState();
  const count = await store.dispatch(getCohortsCount());

  if (state.session.isLoggedIn && count === state.cohorts.length) {
    const { cohorts } = state;
    dispatch({ type: GET_COHORTS_SUCCESS, cohorts });
    return cohorts;
  }

  try {
    const res = await (await fetch('/api/cohorts')).json();

    if (res.error) {
      throw res;
    }
    const { cohorts } = res;
    dispatch({ type: GET_COHORTS_SUCCESS, cohorts });
    return cohorts;
  } catch (error) {
    dispatch({ type: GET_COHORTS_ERROR, error });
    return null;
  }
};

export let getCohortParticipants = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/cohorts/${id}`)).json();

    if (res.error) {
      throw res;
    }
    const {
      cohort,
      cohort: { users }
    } = res;

    // Dispatch the entire "cohort", but return only the users
    dispatch({ type: GET_COHORT_PARTICIPANTS_SUCCESS, cohort });
    return users;
  } catch (error) {
    dispatch({ type: GET_COHORT_PARTICIPANTS_ERROR, error });
    return null;
  }
};

export let getCohortData = (
  cohort_id,
  participant_id,
  scenario_id
) => async dispatch => {
  try {
    const endpoint = scenario_id
      ? `/api/cohorts/${cohort_id}/scenario/${scenario_id}`
      : `/api/cohorts/${cohort_id}/participant/${participant_id}`;

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

export let linkRunToCohort = (cohort_id, run_id) => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/cohorts/${cohort_id}/run/${run_id}`
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
// This is used to link the CURRENT user to a cohort once they've landed on the cohort page
export let linkUserToCohort = (cohort_id, role) => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/cohorts/${cohort_id}/join/${role}`
    )).json();
    if (res.error) {
      throw res;
    }

    const { users, usersById } = res;
    dispatch({ type: SET_COHORT_USER_ROLE_SUCCESS, users, usersById });
    return {
      users,
      usersById
    };
  } catch (error) {
    dispatch({ type: SET_COHORT_USER_ROLE_ERROR, error });
    return null;
  }
};

// This is used to link OTHER users to a cohort
export let addCohortUserRole = (cohort_id, user_id, role) => async dispatch => {
  try {
    const body = JSON.stringify({
      cohort_id,
      user_id,
      roles: [role]
    });
    const res = await (await fetch(`/api/cohorts/${cohort_id}/roles/add`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body
    })).json();
    if (res.error) {
      throw res;
    }
    const { cohort } = res;
    dispatch({ type: SET_COHORT_USER_ROLE_SUCCESS });
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return res;
  } catch (error) {
    dispatch({ type: SET_COHORT_USER_ROLE_ERROR, error });
    return null;
  }
};

export let deleteCohortUserRole = (
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
    const res = await (await fetch(`/api/cohorts/${cohort_id}/roles/delete`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body
    })).json();
    if (res.error) {
      throw res;
    }

    const { cohort } = res;
    dispatch({ type: SET_COHORT_USER_ROLE_SUCCESS });
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return res;
  } catch (error) {
    dispatch({ type: SET_COHORT_USER_ROLE_ERROR, error });
    return null;
  }
};
