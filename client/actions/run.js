import {
  GET_RUN_SUCCESS,
  GET_RUN_ERROR,
  GET_RUNS_SUCCESS,
  GET_RUNS_ERROR,
  GET_RUN_DATA_SUCCESS,
  GET_RUN_DATA_ERROR,
  SET_RUN,
  SET_RUN_SUCCESS,
  SET_RUN_ERROR
} from './types';

export const getRun = scenario_id => async dispatch => {
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

export const getUserRuns = () => async dispatch => {
  try {
    const { runs, error } = await (await fetch('/api/runs')).json();

    if (error) {
      throw error;
    }
    dispatch({ type: GET_RUNS_SUCCESS, runs });
    return runs;
  } catch (error) {
    const { message, status, stack } = error;
    dispatch({ type: GET_RUNS_ERROR, status, message, stack });
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

export const getRunData = params => async dispatch => {
  const { runId } = params;
  try {
    const endpoint = `/api/runs/${runId}`;
    const { prompts, responses, error } = await (await fetch(endpoint)).json();

    if (error) {
      throw error;
    }

    dispatch({ type: GET_RUN_DATA_SUCCESS, prompts, responses });
    return { prompts, responses };
  } catch (error) {
    const { message, stack, status } = error;
    dispatch({
      type: GET_RUN_DATA_ERROR,
      message,
      stack,
      status
    });
    // pass along the error to the promise action
    throw error;
  }
};
