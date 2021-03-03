import {
  GET_INTERACTION_ERROR,
  GET_INTERACTION_SUCCESS,
  GET_INTERACTIONS_ERROR,
  GET_INTERACTIONS_SUCCESS,
  SET_INTERACTION_ERROR,
  SET_INTERACTION_SUCCESS,
GET_INTERACTIONS_TYPES_SUCCESS,
GET_INTERACTIONS_TYPES_ERROR,
} from './types';

export let getInteraction = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/interactions/${id}`)).json();

    if (res.error) {
      throw res;
    }
    const { interaction } = res;

    dispatch({ type: GET_INTERACTION_SUCCESS, interaction });
    return interaction;
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
      const { interaction } = res;
      dispatch({ type: SET_INTERACTION_SUCCESS, interaction });
      return interaction;
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
      const { interaction } = res;
      dispatch({ type: GET_INTERACTION_SUCCESS, interaction });
      return interaction;
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

export let getInteractionsTypes = () => async dispatch => {
  try {
    const res = await (await fetch(`/api/interactions/types`)).json();

    if (res.error) {
      throw res;
    }
    const { types } = res;

    dispatch({ type: GET_INTERACTIONS_TYPES_SUCCESS, types });
    return types;
  } catch (error) {
    dispatch({ type: GET_INTERACTIONS_TYPES_ERROR, error });
    return null;
  }
};
