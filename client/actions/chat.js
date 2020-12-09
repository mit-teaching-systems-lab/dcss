import {
  GET_CHAT_ERROR,
  GET_CHAT_SUCCESS,
  GET_CHATS_ERROR,
  GET_CHATS_SUCCESS,
  SET_CHAT_ERROR,
  SET_CHAT_SUCCESS,
  LINK_CHAT_TO_RUN_ERROR,
  LINK_CHAT_TO_RUN_SUCCESS
} from './types';

export let getChat = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/chats/${id}`)).json();

    if (res.error) {
      throw res;
    }
    const { chat } = res;
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  } catch (error) {
    dispatch({ type: GET_CHAT_ERROR, error });
    return null;
  }
};

export let setChat = (id, params) => async dispatch => {
  try {
    if (Object.values(params).length) {
      const body = JSON.stringify(params);
      const res = await (await fetch(`/api/chats/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })).json();

      if (res.error) {
        throw res;
      }

      const { chat } = res;
      dispatch({ type: SET_CHAT_SUCCESS, chat });
      return chat;
    }
    return null;
  } catch (error) {
    dispatch({ type: SET_CHAT_ERROR, error });
    return null;
  }
};

export let createChat = params => async dispatch => {
  try {
    if (Object.values(params).length) {
      const { lobby_id } = params;
      const body = JSON.stringify({
        lobby_id
      });
      const res = await (await fetch(`/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })).json();

      if (res.error) {
        throw res;
      }
      const { chat } = res;
      dispatch({ type: GET_CHAT_SUCCESS, chat });
      return chat;
    }
    return null;
  } catch (error) {
    dispatch({ type: GET_CHAT_ERROR, error });
    return null;
  }
};

export let getChats = () => async dispatch => {
  try {
    const res = await (await fetch('/api/chats')).json();

    if (res.error) {
      throw res;
    }

    const { chats = [] } = res;
    dispatch({ type: GET_CHATS_SUCCESS, chats });
    return chats;
  } catch (error) {
    dispatch({ type: GET_CHATS_ERROR, error });
    return null;
  }
};

export let linkChatToRun = (chat_id, run_id) => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/chats/link/${chat_id}/run/${run_id}`
    )).json();

    if (res.error) {
      throw res;
    }
    const { chat } = res;
    dispatch({ type: LINK_CHAT_TO_RUN_SUCCESS, chat });
    return chat;
  } catch (error) {
    dispatch({ type: LINK_CHAT_TO_RUN_ERROR, error });
    return null;
  }
};
