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
    const res = await (await fetch(
      `/api/runs/new-or-existing/scenario/${scenario_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )).json();

    if (res.error) {
      throw error;
    }
    const {
      run
    } = res;
    dispatch({ type: GET_RUN_SUCCESS, run });
    return run;
  } catch (error) {
    dispatch({ type: GET_RUN_ERROR, error });
    return null;
  }
};

export const getUserRuns = () => async dispatch => {
  try {
    const res = await (await fetch('/api/runs')).json();

    if (res.error) {
      throw error;
    }
    const {
      runs
    } = res;
    dispatch({ type: GET_RUNS_SUCCESS, runs });
    return runs;
  } catch (error) {
    dispatch({ type: GET_RUNS_ERROR, error });
    return null;
  }
};

export const setRun = (id, data) => async dispatch => {
  dispatch({ type: SET_RUN, run: { id, ...data } });
  try {
    const body = JSON.stringify(data);
    const res = await (await fetch(`/api/runs/${id}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })).json();

    if (res.error) {
      throw error;
    }

    const {
      run
    } = res;

    dispatch({ type: SET_RUN_SUCCESS, run });
    return run;
  } catch (error) {
    dispatch({ type: SET_RUN_ERROR, error });
    return null;
  }
};

export const getRunData = params => async dispatch => {
  const { runId } = params;
  try {
    const endpoint = `/api/runs/${runId}`;
    const res = await (await fetch(endpoint)).json();

    if (res.error) {
      throw error;
    }

    const { prompts, responses } = res;

    dispatch({ type: GET_RUN_DATA_SUCCESS, prompts, responses });
    return { prompts, responses };
  } catch (error) {
    dispatch({ type: GET_RUN_DATA_ERROR, error });
    return null;
  }
};
