import {
  GET_AGENT_ERROR,
  GET_AGENT_SUCCESS,
  GET_AGENTS_ERROR,
  GET_AGENTS_SUCCESS,
  SET_AGENT_ERROR,
  SET_AGENT_SUCCESS
} from './types';

export let getAgent = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/agents/${id}`)).json();

    if (res.error) {
      throw res;
    }
    const { agent } = res;

    dispatch({ type: GET_AGENT_SUCCESS, agent });
    return agent;
  } catch (error) {
    dispatch({ type: GET_AGENT_ERROR, error });
    return null;
  }
};

export let setAgent = (id, params) => async dispatch => {
  try {
    if (Object.values(params).length) {
      const body = JSON.stringify(params);
      const res = await (await fetch(`/api/agents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })).json();

      if (res.error) {
        throw res;
      }
      const { agent } = res;
      dispatch({ type: SET_AGENT_SUCCESS, agent });
      return agent;
    }
    return null;
  } catch (error) {
    dispatch({ type: SET_AGENT_ERROR, error });
    return null;
  }
};

export let createAgent = params => async dispatch => {
  try {
    if (Object.values(params).length) {
      const body = JSON.stringify(params);
      const res = await (await fetch(`/api/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })).json();

      if (res.error) {
        throw res;
      }
      const { agent } = res;
      dispatch({ type: GET_AGENT_SUCCESS, agent });
      return agent;
    }
    return null;
  } catch (error) {
    dispatch({ type: GET_AGENT_ERROR, error });
    return null;
  }
};

export let getAgents = filter => async dispatch => {
  try {
    const url =
      filter === 'is_active' ? '/api/agents/is_active' : '/api/agents';

    const res = await (await fetch(url)).json();

    if (res.error) {
      throw res;
    }

    const { agents = [] } = res;
    dispatch({ type: GET_AGENTS_SUCCESS, agents });
    return agents;
  } catch (error) {
    dispatch({ type: GET_AGENTS_ERROR, error });
    return null;
  }
};
