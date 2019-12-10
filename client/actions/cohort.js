import {
    CREATE_COHORT,
    CREATE_COHORT_SUCCESS,
    CREATE_COHORT_ERROR,
    SET_COHORT,
    // SET_COHORT_SUCCESS,
    // SET_COHORT_ERROR,
    GET_COHORT,
    GET_COHORT_SUCCESS,
    GET_COHORT_ERROR,
    GET_COHORT_PARTICIPANTS,
    GET_COHORT_PARTICIPANTS_SUCCESS,
    GET_COHORT_PARTICIPANTS_ERROR,
    GET_COHORT_DATA,
    GET_COHORT_DATA_SUCCESS,
    GET_COHORT_DATA_ERROR,
    GET_USER_COHORTS,
    GET_USER_COHORTS_SUCCESS,
    GET_USER_COHORTS_ERROR,
    LINK_COHORT_TO_RUN,
    LINK_COHORT_TO_RUN_SUCCESS,
    LINK_COHORT_TO_RUN_ERROR,
    SET_COHORT_USER_ROLE,
    SET_COHORT_USER_ROLE_SUCCESS,
    SET_COHORT_USER_ROLE_ERROR
} from './types';

export const createCohort = ({ name }) => async dispatch => {
    dispatch({ type: CREATE_COHORT, payload: { name } });
    try {
        const res = await fetch('/api/cohort', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        const { cohort, error } = await res.json();
        if (error) {
            throw error;
        }
        dispatch({ type: CREATE_COHORT_SUCCESS, cohort });
        // return the cohort to the promise action for redirection purposes
        return cohort;
    } catch (error) {
        const { message, stack, status } = error;
        dispatch({ type: CREATE_COHORT_ERROR, message, stack, status });
        // pass along the error to the promise action
        throw error;
    }
};

export const setCohort = cohort => ({
    type: SET_COHORT,
    cohort
});

export const getCohort = id => async dispatch => {
    if (Number.isNaN(id)) {
        return;
    }
    dispatch({ type: GET_COHORT, payload: { id } });
    try {
        const { cohort, error } = await (await fetch(
            `/api/cohort/${id}`
        )).json();

        if (error) {
            throw error;
        }
        dispatch({ type: GET_COHORT_SUCCESS, cohort });
        // return the cohort to the promise action for redirection purposes
        return cohort;
    } catch (error) {
        const { message, stack, status } = error;
        dispatch({ type: GET_COHORT_ERROR, message, stack, status });
        // pass along the error to the promise action
        throw error;
    }
};

export const getCohorts = params => async dispatch => {
    dispatch({ type: GET_USER_COHORTS, params });
    try {
        const { cohorts, error } = await (await fetch('/api/cohort/my')).json();
        if (error) {
            throw error;
        }
        dispatch({ type: GET_USER_COHORTS_SUCCESS, cohorts });
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: GET_USER_COHORTS_ERROR, status, message, stack });
    }
};

export const setCohortUserRole = ({ id, role }) => async dispatch => {
    dispatch({ type: SET_COHORT_USER_ROLE });
    try {
        const users = await (await fetch(
            `/api/cohort/${id}/join/${role}`
        )).json();
        dispatch({ type: SET_COHORT_USER_ROLE_SUCCESS, users });
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: SET_COHORT_USER_ROLE_ERROR, status, message, stack });
    }
};

export const getCohortParticipants = id => async dispatch => {
    dispatch({ type: GET_COHORT_PARTICIPANTS });
    try {
        const {
            cohort,
            cohort: { users },
            error
        } = await (await fetch(`/api/cohort/${id}`)).json();

        if (error) {
            throw error;
        }

        // Dispatch the entire "cohort", but only the "users" property
        // will be used in the reducer.
        dispatch({ type: GET_COHORT_PARTICIPANTS_SUCCESS, cohort });
        // return the cohort to the promise action for redirection purposes
        return users;
    } catch (error) {
        const { message, stack, status } = error;
        dispatch({
            type: GET_COHORT_PARTICIPANTS_ERROR,
            message,
            stack,
            status
        });
        // pass along the error to the promise action
        throw error;
    }
};

export const getCohortData = params => async dispatch => {
    const { cohortId, participantId, scenarioId } = params;
    dispatch({ type: GET_COHORT_DATA });
    try {
        const endpoint = scenarioId
            ? `/api/cohort/${cohortId}/scenario/${scenarioId}`
            : `/api/cohort/${cohortId}/participant/${participantId}`;

        const { prompts, responses, error } = await (await fetch(
            endpoint
        )).json();

        if (error) {
            throw error;
        }

        dispatch({ type: GET_COHORT_DATA_SUCCESS, prompts, responses });
        return { prompts, responses };
    } catch (error) {
        const { message, stack, status } = error;
        dispatch({
            type: GET_COHORT_DATA_ERROR,
            message,
            stack,
            status
        });
        // pass along the error to the promise action
        throw error;
    }
};

export const linkCohortToRun = (cohortId, runId) => async dispatch => {
    dispatch({ type: LINK_COHORT_TO_RUN });
    try {
        const { cohort } = await (await fetch(
            `/api/cohort/${cohortId}/run/${runId}`
        )).json();

        dispatch({ type: LINK_COHORT_TO_RUN_SUCCESS });
        dispatch({ type: GET_COHORT_SUCCESS, cohort });
        return cohort;
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: LINK_COHORT_TO_RUN_ERROR, status, message, stack });
    }
};
