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
  GET_SCENARIOS_COUNT_SUCCESS,
  GET_SCENARIOS_COUNT_ERROR,
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
import store from '@client/store';

import { initialScenarioState } from '@reducers/scenario';

export let getScenario = (id, options) => async dispatch => {
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

export let getScenariosCount = () => async dispatch => {
  try {
    const res = await (await fetch('/api/scenarios/count')).json();
    if (res.error) {
      throw res;
    }
    const count = Number(res.count);

    dispatch({ type: GET_SCENARIOS_COUNT_SUCCESS, count });
    return count;
  } catch (error) {
    dispatch({ type: GET_SCENARIOS_COUNT_ERROR, error });
    return null;
  }
};

export let getScenarios = () => async (dispatch, getState) => {
  const state = getState();
  const count = await store.dispatch(getScenariosCount());

  if (state.login.isLoggedIn && count === state.scenarios.length) {
    const { scenarios } = state;
    dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  }

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

export let getScenariosByStatus = status => async (dispatch, getState) => {
  const state = getState();
  const count = await store.dispatch(getScenariosCount());
  if (state.login.isLoggedIn && count === state.scenarios.length) {
    const scenarios = state.scenarios.filter(
      scenario => scenario.status === status
    );
    dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  }

  try {
    const res = await (await fetch(`/api/scenarios/status/${status}`)).json();
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

const getScenariosIncrementallyRequest = async (
  direction,
  offset,
  limit,
  dispatch
) => {
  const url = `/api/scenarios/${direction}/${offset}/${limit}`;
  const res = await (await fetch(url)).json();

  if (res.error) {
    throw res;
  }

  const { scenarios = [] } = res;

  if (scenarios && scenarios.length) {
    dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
  }

  return scenarios;
};

const getScenariosIncrementallyNext = async (
  direction,
  offset,
  limit,
  dispatch,
  updater
) => {
  let captured = [];
  let scenarios = [];
  do {
    offset += limit;
    scenarios = await getScenariosIncrementallyRequest(
      direction,
      offset,
      limit,
      dispatch
    );
    captured.push(...scenarios);
  } while (scenarios.length === limit);

  if (updater) {
    updater(scenarios);
  }
};

const getScenariosIncrementallyFirst = async (
  direction,
  offset,
  limit,
  dispatch,
  updater
) => {
  let resolver;
  let deferred = new Promise(resolve => {
    resolver = resolve;
  });

  getScenariosIncrementallyRequest(
    direction,
    offset,
    limit,
    dispatch,
    updater
  ).then(scenarios => {
    resolver(scenarios);

    if (scenarios.length === limit) {
      getScenariosIncrementallyNext(
        direction,
        offset,
        limit,
        dispatch,
        updater
      );
    }
  });
  return deferred;
};

export let getScenariosIncrementally = updater => async (
  dispatch,
  getState
) => {
  const state = getState();
  const count = await store.dispatch(getScenariosCount());
  if (state.login.isLoggedIn && count === state.scenarios.length) {
    const { scenarios } = state;
    dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  }

  let direction = 'DESC';
  let offset = 0;
  let limit = 30;
  const returnValue = await getScenariosIncrementallyFirst(
    direction,
    offset,
    limit,
    dispatch,
    updater
  );
  return returnValue;
};

export let getScenariosSlice = (
  direction = 'DESC',
  offset = 0,
  limit = 30
) => async (dispatch, getState) => {
  const state = getState();
  const count = await store.dispatch(getScenariosCount());
  if (state.login.isLoggedIn && count === state.scenarios.length) {
    const { scenarios } = state;
    dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  }

  try {
    const url = `/api/scenarios/${direction}/${offset}/${limit}`;
    const res = await (await fetch(url)).json();

    if (res.error) {
      throw res;
    }
    const { scenarios = [] } = res;

    dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  } catch (error) {
    dispatch({ type: GET_SCENARIOS_ERROR, error });
    return null;
  }
};

export let getSlides = id => async dispatch => {
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

export let setScenario = scenario => {
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

export let setScenarios = scenarios => ({
  type: SET_SCENARIOS,
  scenarios
});

export let setSlides = slides => ({
  type: SET_SLIDES,
  slides
});

export let copyScenario = scenario_id => async dispatch => {
  try {
    const res = await (
      await fetch(`/api/scenarios/${scenario_id}/copy`, {
        method: 'POST'
      })
    ).json();

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

export let deleteScenario = scenario_id => async dispatch => {
  try {
    const res = await (
      await fetch(`/api/scenarios/${scenario_id}`, {
        method: 'DELETE'
      })
    ).json();

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

export let endScenarioLock = scenario_id => async dispatch => {
  try {
    const res = await (
      await fetch(`/api/scenarios/${scenario_id}/unlock`)
    ).json();

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

export let deleteSlide = (scenario_id, id) => async dispatch => {
  try {
    const res = await (
      await fetch(`/api/scenarios/${scenario_id}/slides/${id}`, {
        method: 'DELETE'
      })
    ).json();

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

export let addScenarioUserRole = (
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

    const result = await (
      await fetch(`/api/scenarios/${scenario_id}/roles/add`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      })
    ).json();

    const { scenario } = result;

    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return result;
  } catch (error) {
    dispatch({ type: GET_SCENARIO_ERROR, error });
    return null;
  }
};

export let endScenarioUserRole = (
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
    const result = await (
      await fetch(`/api/scenarios/${scenario_id}/roles/end`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      })
    ).json();

    const { scenario } = result;

    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return result;
  } catch (error) {
    dispatch({ type: GET_SCENARIO_ERROR, error });
    return null;
  }
};
