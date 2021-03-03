import {
  GET_INTERACTION_ERROR,
  GET_INTERACTION_SUCCESS,
  GET_INTERACTIONS_ERROR,
  GET_INTERACTIONS_SUCCESS,
  SET_INTERACTION_ERROR,
  SET_INTERACTION_SUCCESS
} from './types';

export let getInteraction = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/interactions/${id}`)).json();

    if (res.error) {
      throw res;
    }
    const { agent } = res;

    dispatch({ type: GET_INTERACTION_SUCCESS, agent });
    return agent;
  } catch (error) {
    dispatch({ type: GET_INTERACTION_ERROR, error });
    return null;
  }
};

export let setInteraction = (id, params) => async dispatch => {
  try {
    if (Object.values(params).length) {
      const body = JSON.stringify(params);
      const res = await (await fetch(`/api/interactions/${id}`, {
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
      dispatch({ type: SET_INTERACTION_SUCCESS, agent });
      return agent;
    }
    return null;
  } catch (error) {
    dispatch({ type: SET_INTERACTION_ERROR, error });
    return null;
  }
};

export let createInteraction = params => async dispatch => {
  try {
    if (Object.values(params).length) {
      const body = JSON.stringify(params);
      const res = await (await fetch(`/api/interactions`, {
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
      dispatch({ type: GET_INTERACTION_SUCCESS, agent });
      return agent;
    }
    return null;
  } catch (error) {
    dispatch({ type: GET_INTERACTION_ERROR, error });
    return null;
  }
};

export let getInteractions = () => async dispatch => {
  try {
    const res = await (await fetch(`/api/interactions`)).json();

    if (res.error) {
      throw res;
    }
    const { interactions } = res;

    dispatch({ type: GET_INTERACTIONS_SUCCESS, interactions });
    return interactions;
  } catch (error) {
    dispatch({ type: GET_INTERACTIONS_ERROR, error });
    return null;
  }
};
