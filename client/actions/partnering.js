import { GET_PARTNERING_ERROR, GET_PARTNERING_SUCCESS } from './types';

export let getPartnering = () => async (dispatch, getState) => {
  const state = getState();

  if (state.partnering.length) {
    return state.partnering;
  }

  try {
    const res = await (await fetch('/api/partnering')).json();

    if (res.error) {
      throw res;
    }

    const { partnering } = res;

    dispatch({ type: GET_PARTNERING_SUCCESS, partnering });
    return partnering;
  } catch (error) {
    dispatch({ type: GET_PARTNERING_ERROR, error });
    return null;
  }
};
