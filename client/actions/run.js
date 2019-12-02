import {
    GET_RUN,
    GET_RUN_SUCCESS,
    GET_RUN_ERROR,
    SET_RUN,
    SET_RUN_SUCCESS,
    SET_RUN_ERROR
} from './types';

export const getRun = scenario_id => async dispatch => {
    dispatch({ type: GET_RUN, scenario_id });
    try {
        const { run, error } = await (await fetch(
            `/api/runs/new-or-existing/scenario/${scenario_id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).json();

        if (error) {
            throw error;
        }
        dispatch({ type: GET_RUN_SUCCESS, run });
        return run;
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: GET_RUN_ERROR, status, message, stack });
    }
};

export const setRun = (id, data) => async dispatch => {
    dispatch({ type: SET_RUN, run: { id, ...data } });
    try {
        const body = JSON.stringify(data);
        const { run, error } = await (await fetch(`/api/runs/${id}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })).json();

        if (error) {
            throw error;
        }
        dispatch({ type: SET_RUN_SUCCESS, run });
        return run;
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: SET_RUN_ERROR, status, message, stack });
    }
};
