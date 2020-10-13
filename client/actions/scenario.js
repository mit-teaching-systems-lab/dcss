import cloneDeep from 'lodash.clonedeep';
import {
  // GET_SCENARIO,
  COPY_SCENARIO_SUCCESS,
  COPY_SCENARIO_ERROR,
  DELETE_SCENARIO_SUCCESS,
  DELETE_SCENARIO_ERROR,
  GET_SCENARIO_SUCCESS,
  GET_SCENARIO_ERROR,
  UNLOCK_SCENARIO_SUCCESS,
  UNLOCK_SCENARIO_ERROR,
  // GET_SCENARIOS,
  GET_SCENARIOS_SUCCESS,
  GET_SCENARIOS_ERROR,
  // GET_SLIDES,
  GET_SLIDES_SUCCESS,
  GET_SLIDES_ERROR,
  DELETE_SLIDE_SUCCESS,
  DELETE_SLIDE_ERROR,
  SET_SCENARIO,
  // SET_SCENARIO_SUCCESS,
  // SET_SCENARIO_ERROR,
  SET_SCENARIOS,
  // SET_SCENARIOS_SUCCESS,
  // SET_SCENARIOS_ERROR,
  SET_SLIDES
} from './types';

import { initialScenarioState } from '@reducers/scenario';

export const getScenario = (id, options) => async dispatch => {
  let url = `/api/scenarios/${id}`;

  if (options) {
    if (options.lock) {
      url = `/api/scenarios/${id}/lock`;
    }

    if (options.unlock) {
      url = `/api/scenarios/${id}/unlock`;
    }
  }

  try {
    const res = await (await fetch(url)).json();

    if (res.error) {
      throw res;
    }
    const { scenario } = res;

    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return scenario;
  } catch (error) {
    dispatch({ type: GET_SCENARIO_ERROR, error });
    return null;
  }
};

export const getScenarios = () => async dispatch => {
  try {
    const res = await (await fetch('/api/scenarios')).json();
    if (res.error) {
      throw res;
    }
    const { scenarios } = res;

    dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  } catch (error) {
    dispatch({ type: GET_SCENARIOS_ERROR, error });
    return null;
  }
};

export const getSlides = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/scenarios/${id}/slides`)).json();

    if (res.error) {
      throw res;
    }
    const { slides } = res;

    dispatch({ type: GET_SLIDES_SUCCESS, slides });
    return slides;
  } catch (error) {
    dispatch({ type: GET_SLIDES_ERROR, error });
    return null;
  }
};

export const setScenario = scenario => {
  if (scenario === null) {
    const clone = cloneDeep(initialScenarioState);
    return {
      type: SET_SCENARIO,
      scenario: {
        ...clone,
        finish: {
          components: [
            {
              html: `<h2>Thanks for participating!</h2>`
            }
          ],
          is_finish: true,
          title: ''
        }
      }
    };
  }

  return {
    type: SET_SCENARIO,
    scenario
  };
};

export const setScenarios = scenarios => ({
  type: SET_SCENARIOS,
  scenarios
});

export const setSlides = slides => ({
  type: SET_SLIDES,
  slides
});

export const copyScenario = scenario_id => async dispatch => {
  try {
    const res = await (await fetch(`/api/scenarios/${scenario_id}/copy`, {
      method: 'POST'
    })).json();

    if (res.error) {
      throw res;
    }

    const { scenario } = res;

    dispatch({ type: COPY_SCENARIO_SUCCESS, scenario });
    return scenario;
  } catch (error) {
    dispatch({ type: COPY_SCENARIO_ERROR, error });
    return null;
  }
};

export const deleteScenario = scenario_id => async dispatch => {
  try {
    const res = await (await fetch(`/api/scenarios/${scenario_id}`, {
      method: 'DELETE'
    })).json();

    if (res.error) {
      throw res;
    }

    const { scenario } = res;

    dispatch({ type: DELETE_SCENARIO_SUCCESS, scenario });
    return scenario;
  } catch (error) {
    dispatch({ type: DELETE_SCENARIO_ERROR, error });
    return null;
  }
};

export const endScenarioLock = scenario_id => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/scenarios/${scenario_id}/unlock`
    )).json();

    if (res.error) {
      throw res;
    }

    const { scenario } = res;

    dispatch({ type: UNLOCK_SCENARIO_SUCCESS, scenario });
    return scenario;
  } catch (error) {
    dispatch({ type: UNLOCK_SCENARIO_ERROR, error });
    return null;
  }
};

export const deleteSlide = (scenario_id, id) => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/scenarios/${scenario_id}/slides/${id}`,
      {
        method: 'DELETE'
      }
    )).json();

    if (res.error) {
      throw res;
    }

    const { slides } = res;

    dispatch({ type: DELETE_SLIDE_SUCCESS, slides });
    return slides;
  } catch (error) {
    dispatch({ type: DELETE_SLIDE_ERROR, error });
    return null;
  }
};

export const addScenarioUserRole = (
  scenario_id,
  user_id,
  role
) => async dispatch => {
  try {
    const body = JSON.stringify({
      scenario_id,
      user_id,
      roles: [role]
    });

    const result = await (await fetch(
      `/api/scenarios/${scenario_id}/roles/add`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      }
    )).json();

    const { scenario } = result;

    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return result;
  } catch (error) {
    dispatch({ type: GET_SCENARIO_ERROR, error });
    return null;
  }
};

export const endScenarioUserRole = (
  scenario_id,
  user_id,
  role
) => async dispatch => {
  try {
    const body = JSON.stringify({
      scenario_id,
      user_id,
      roles: [role]
    });
    const result = await (await fetch(
      `/api/scenarios/${scenario_id}/roles/end`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      }
    )).json();

    const { scenario } = result;

    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return result;
  } catch (error) {
    dispatch({ type: GET_SCENARIO_ERROR, error });
    return null;
  }
};
