import {
  GET_RUN_SUCCESS,
  GET_RUN_ERROR,
  GET_RUNS_SUCCESS,
  GET_RUNS_ERROR,
  GET_RUN_DATA_SUCCESS,
  GET_RUN_DATA_ERROR,
  SAVE_RUN_EVENT_SUCCESS,
  SAVE_RUN_EVENT_ERROR,
  SET_RUN,
  SET_RUN_SUCCESS,
  SET_RUN_ERROR
} from './types';

export const getRun = scenario_id => async dispatch => {
  try {
    const res = await (
      await fetch(`/api/runs/new-or-existing/scenario/${scenario_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ).json();

    if (res.error) {
      throw res;
    }
    const { run } = res;
    dispatch({ type: GET_RUN_SUCCESS, run });
    return run;
  } catch (error) {
    dispatch({ type: GET_RUN_ERROR, error });
    return null;
  }
};

export const getRuns = () => async dispatch => {
  try {
    const res = await (await fetch('/api/runs')).json();

    if (res.error) {
      throw res;
    }
    const { runs } = res;
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
    const res = await (
      await fetch(`/api/runs/${id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
    ).json();

    if (res.error) {
      throw res;
    }

    const { run } = res;

    dispatch({ type: SET_RUN_SUCCESS, run });
    return run;
  } catch (error) {
    dispatch({ type: SET_RUN_ERROR, error });
    return null;
  }
};

export const getRunData = run_id => async dispatch => {
  try {
    const endpoint = `/api/runs/${run_id}`;
    const res = await (await fetch(endpoint)).json();

    if (res.error) {
      throw res;
    }

    const { prompts, responses } = res;

    dispatch({ type: GET_RUN_DATA_SUCCESS, prompts, responses });
    return { prompts, responses };
  } catch (error) {
    dispatch({ type: GET_RUN_DATA_ERROR, error });
    return null;
  }
};

export const saveRunEvent = (run_id, name, data) => async dispatch => {
  try {
    const timestamp = Date.now();
    const url = location.href;
    const context = {
      timestamp,
      url,
      ...data
    };

    const body = JSON.stringify({
      name,
      context
    });

    const res = await (
      await fetch(`/api/runs/${run_id}/event/${name}`, {
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

    // This nested block provides a new scope contour
    // for the "event" binding creating on the next line.
    // Without this, it would interfere with the parameter
    // named "event"
    const { event } = res;
    dispatch({ type: SAVE_RUN_EVENT_SUCCESS, name, event });
    return event;
  } catch (error) {
    dispatch({ type: SAVE_RUN_EVENT_ERROR, error });
    return null;
  }
};
