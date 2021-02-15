import {
  GET_INVITES_ERROR,
  GET_INVITES_SUCCESS,
  SET_INVITE_ERROR,
  SET_INVITE_SUCCESS
} from './types';

export let getInvites = () => async dispatch => {
  try {
    const res = await (await fetch(`/api/invites`)).json();

    if (res.error) {
      throw res;
    }
    const { invites } = res;
    dispatch({ type: GET_INVITES_SUCCESS, invites });
    return invites;
  } catch (error) {
    dispatch({ type: GET_INVITES_ERROR, error });
    return null;
  }
};

export let setInvite = (id, params) => async dispatch => {
  try {
    const { status } = params;
    const updates = {};

    if (status) {
      updates.status = status;
    }

    const body = JSON.stringify(updates);
    const res = await (await fetch(`/api/invites/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })).json();

    if (res.error) {
      throw res;
    }

    const { invites } = res;
    const invite = invites.find(invite => invite.id === id);

    dispatch({ type: SET_INVITE_SUCCESS, invite });
    return invite;
  } catch (error) {
    dispatch({ type: SET_INVITE_ERROR, error });
    return null;
  }
};
