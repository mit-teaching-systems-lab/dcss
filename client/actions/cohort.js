import {
  CREATE_COHORT_SUCCESS,
  CREATE_COHORT_ERROR,
  SET_COHORT_SUCCESS,
  SET_COHORT_ERROR,
  SET_COHORT_SCENARIOS_SUCCESS,
  SET_COHORT_SCENARIOS_ERROR,
  GET_COHORT_SUCCESS,
  GET_COHORT_ERROR,
  GET_COHORT_PARTICIPANTS_SUCCESS,
  GET_COHORT_PARTICIPANTS_ERROR,
  GET_COHORT_RUN_DATA_ERROR,
  GET_ALL_COHORTS_SUCCESS,
  GET_ALL_COHORTS_ERROR,
  GET_USER_COHORTS_SUCCESS,
  GET_USER_COHORTS_ERROR,
  LINK_RUN_TO_COHORT_SUCCESS,
  LINK_RUN_TO_COHORT_ERROR,
  SET_COHORT_USER_ROLE_SUCCESS,
  SET_COHORT_USER_ROLE_ERROR
} from './types';

export let createCohort = ({ name }) => async dispatch => {
  try {
    const res = await (
      await fetch('/api/cohort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      })
    ).json();

    if (res.error) {
      throw res;
    }
    const { cohort } = res;
    cohort.role = 'owner';
    dispatch({ type: CREATE_COHORT_SUCCESS, cohort });
    // return the cohort to the promise action for redirection purposes
    return cohort;
  } catch (error) {
    dispatch({ type: CREATE_COHORT_ERROR, error });
    return null;
  }
};

export let setCohortScenarios = cohort => async dispatch => {
  try {
    const { scenarios } = cohort;
    const body = JSON.stringify({
      scenarios
    });
    const res = await (
      await fetch(`/api/cohort/${cohort.id}/scenarios`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
    ).json();

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

export let setCohort = cohort => async dispatch => {
  try {
    const { name, deleted_at } = cohort;
    const updates = {};

    if (name) {
      updates.name = name;
    }

    if (deleted_at) {
      updates.deleted_at = deleted_at;
    }

    const body = JSON.stringify(updates);
    const res = await (
      await fetch(`/api/cohort/${cohort.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
    ).json();

    if (res.error) {
      throw res;
    }

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

export let getCohorts = () => async dispatch => {
  try {
    const res = await (await fetch('/api/cohort/my')).json();

    if (res.error) {
      throw res;
    }
    const { cohorts } = res;
    dispatch({ type: GET_USER_COHORTS_SUCCESS, cohorts });
  } catch (error) {
    dispatch({ type: GET_USER_COHORTS_ERROR, error });
    return null;
  }
};

export let getAllCohorts = () => async dispatch => {
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

export let getCohortParticipants = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/cohort/${id}`)).json();

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

export let linkRunToCohort = (cohort_id, run_id) => async dispatch => {
  try {
    const res = await (
      await fetch(`/api/cohort/${cohort_id}/run/${run_id}`)
    ).json();
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
    const res = await (
      await fetch(`/api/cohort/${cohort_id}/join/${role}`)
    ).json();
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
    const res = await (
      await fetch('/api/cohort/${cohort_id}/roles/add', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      })
    ).json();
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
    const res = await (
      await fetch('/api/cohort/${cohort_id}/roles/delete', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      })
    ).json();
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
