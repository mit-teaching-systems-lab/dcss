import {
  COPY_SCENARIO_ERROR,
  COPY_SCENARIO_SUCCESS,
  DELETE_SCENARIO_ERROR,
  DELETE_SCENARIO_SUCCESS,
  DELETE_SLIDE_ERROR,
  DELETE_SLIDE_SUCCESS,
  GET_RECENT_SCENARIOS_ERROR,
  GET_RECENT_SCENARIOS_SUCCESS,
  GET_SCENARIOS_COUNT_ERROR,
  GET_SCENARIOS_COUNT_SUCCESS,
  GET_SCENARIOS_ERROR,
  GET_SCENARIOS_SUCCESS,
  GET_SCENARIO_ERROR,
  GET_SCENARIO_PROMPT_COMPONENTS_ERROR,
  GET_SCENARIO_PROMPT_COMPONENTS_SUCCESS,
  GET_SCENARIO_SUCCESS,
  GET_SLIDES_ERROR,
  GET_SLIDES_SUCCESS,
  SET_SCENARIO,
  SET_SCENARIOS,
  SET_SLIDES,
  UNLOCK_SCENARIO_ERROR,
  UNLOCK_SCENARIO_SUCCESS
} from './types';

import cloneDeep from 'lodash.clonedeep';
import { scenarioInitialState } from '@reducers/initial-states';
import store from '@client/store';

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

export let getScenarioPromptComponents = id => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/scenarios/${id}/slides/prompt-components`
    )).json();

    if (res.error) {
      throw res;
    }
    const { components: prompts } = res;

    dispatch({ type: GET_SCENARIO_PROMPT_COMPONENTS_SUCCESS, prompts });
    return prompts;
  } catch (error) {
    dispatch({ type: GET_SCENARIO_PROMPT_COMPONENTS_ERROR, error });
    return null;
  }
};

let cachedCount = 0;
export let getScenariosCount = (
  options = { refresh: false }
) => async dispatch => {
  const { refresh } = options;
  if (!refresh && cachedCount) {
    const count = cachedCount;
    dispatch({ type: GET_SCENARIOS_COUNT_SUCCESS, count });
    return count;
  }
  try {
    const url = `/api/scenarios/count`;
    const res = await (await fetch(url)).json();
    if (res.error) {
      throw res;
    }
    const count = Number(res.count);

    dispatch({ type: GET_SCENARIOS_COUNT_SUCCESS, count });
    cachedCount = count;
    return count;
  } catch (error) {
    dispatch({ type: GET_SCENARIOS_COUNT_ERROR, error });
    cachedCount = 0;
    return null;
  }
};

export let getScenarios = () => async (dispatch, getState) => {
  const state = getState();
  const count = await store.dispatch(getScenariosCount({ refresh: true }));

  if (state.session.isLoggedIn && count === state.scenarios.length) {
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
  const count = await store.dispatch(getScenariosCount({ refresh: true }));
  if (state.session.isLoggedIn && count === state.scenarios.length) {
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

export const getScenariosIncrementallyRequest = async (
  direction,
  offset,
  limit,
  dispatch
) => {
  const url = `/api/scenarios/slice/${direction}/${offset}/${limit}`;
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

export const getScenariosIncrementallyNext = async (
  direction,
  offset,
  limit,
  dispatch,
  updater
) => {
  const count = await store.dispatch(getScenariosCount({ refresh: true }));
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
  } while (offset < count);

  if (updater) {
    updater(scenarios);
  }

  return scenarios;
};

export const getScenariosIncrementallyFirst = async (
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
  const count = await store.dispatch(getScenariosCount({ refresh: true }));
  if (state.session.isLoggedIn && count === state.scenarios.length) {
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
  // This call does not refresh!
  const count = await store.dispatch(getScenariosCount());
  if (state.session.isLoggedIn && count === state.scenarios.length) {
    const { scenarios } = state;
    dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  }

  try {
    const url = `/api/scenarios/slice/${direction}/${offset}/${limit}`;
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

export let getRecentScenarios = (
  orderBy = 'updated_at',
  limit = 4
) => async dispatch => {
  try {
    const url = `/api/scenarios/recent/${orderBy}/${limit}`;
    const res = await (await fetch(url)).json();

    if (res.error) {
      throw res;
    }
    const { scenarios = [] } = res;

    dispatch({
      type: GET_RECENT_SCENARIOS_SUCCESS,
      recentScenarios: scenarios
    });
    return scenarios;
  } catch (error) {
    dispatch({ type: GET_RECENT_SCENARIOS_ERROR, error });
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
    const clone = cloneDeep(scenarioInitialState);
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

export let deleteScenario = scenario_id => async dispatch => {
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

export let endScenarioLock = scenario_id => async dispatch => {
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

export let deleteSlide = (scenario_id, id) => async dispatch => {
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

    const res = await (await fetch(`/api/scenarios/${scenario_id}/roles/add`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body
    })).json();

    if (res.error) {
      throw res;
    }

    const { scenario } = res;

    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return res;
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
    const res = await (await fetch(`/api/scenarios/${scenario_id}/roles/end`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body
    })).json();

    if (res.error) {
      throw res;
    }

    const { scenario } = res;

    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return res;
  } catch (error) {
    dispatch({ type: GET_SCENARIO_ERROR, error });
    return null;
  }
};
