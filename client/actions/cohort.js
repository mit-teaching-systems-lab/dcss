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
    GET_USER_COHORTS,
    GET_USER_COHORTS_SUCCESS,
    GET_USER_COHORTS_ERROR
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
