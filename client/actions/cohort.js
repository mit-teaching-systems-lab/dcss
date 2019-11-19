import {
    COHORT_REQUEST_LIST,
    COHORT_REQUEST_LIST_ERROR,
    COHORT_REQUEST_LIST_SUCCESS,
    COHORT_CREATE,
    COHORT_CREATE_SUCCESS,
    COHORT_CREATE_ERROR
} from './types';

export const cohortRequestList = params => async dispatch => {
    dispatch({ type: COHORT_REQUEST_LIST, params });
    try {
        const res = await fetch('/api/cohort/');
        const { cohorts, error } = await res.json();
        if (error) {
            throw error;
        }
        dispatch({ type: COHORT_REQUEST_LIST_SUCCESS, cohorts });
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: COHORT_REQUEST_LIST_ERROR, status, message, stack });
    }
};

export const cohortCreate = ({ name }) => async dispatch => {
    dispatch({ type: COHORT_CREATE, payload: { name } });
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
        dispatch({ type: COHORT_CREATE_SUCCESS, cohort });
        // return the cohort to the promise action for redirection purposes
        return cohort;
    } catch (error) {
        const { message, stack, status } = error;
        dispatch({ type: COHORT_CREATE_ERROR, message, stack, status });
        // pass along the error to the promise action
        throw error;
    }
};
