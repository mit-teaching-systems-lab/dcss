import {
  CREATE_CHAT_INVITE_SUCCESS,
  CREATE_CHAT_INVITE_ERROR,
  GET_CHAT_ERROR,
  GET_CHAT_SUCCESS,
  GET_CHAT_MESSAGES_ERROR,
  GET_CHAT_MESSAGES_SUCCESS,
  GET_CHAT_MESSAGES_COUNT_ERROR,
  GET_CHAT_MESSAGES_COUNT_SUCCESS,
  GET_CHAT_USERS_ERROR,
  GET_CHAT_USERS_SUCCESS,
  GET_CHATS_ERROR,
  GET_CHATS_SUCCESS,
  SET_CHAT_ERROR,
  SET_CHAT_SUCCESS,
  SET_CHAT_MESSAGE_ERROR,
  SET_CHAT_MESSAGE_SUCCESS,
  SET_CHAT_USERS_SUCCESS,
  LINK_RUN_TO_CHAT_ERROR,
  LINK_RUN_TO_CHAT_SUCCESS
} from './types';

export let createChat = (scenario, cohort, isOpen) => async dispatch => {
  try {
    const body = JSON.stringify({
      cohort_id: cohort ? cohort.id : null,
      scenario_id: scenario.id,
      is_open: isOpen
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
  } catch (error) {
    dispatch({ type: GET_CHAT_ERROR, error });
    return null;
  }
};

export let getChat = (scenario_id, cohort_id) => async dispatch => {
  try {
    const url = cohort_id
      ? `/api/chats/new-or-existing/scenario/${scenario_id}/cohort/${cohort_id}`
      : `/api/chats/new-or-existing/scenario/${scenario_id}`;

    const res = await (await fetch(url)).json();

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

export let createChatInvite = (id, selection) => async dispatch => {
  try {
    const body = JSON.stringify({
      invite: selection
    });
    const res = await (await fetch(`/api/chats/${id}/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })).json();

    if (res.error) {
      throw res;
    }
    const { invite } = res;
    dispatch({ type: CREATE_CHAT_INVITE_SUCCESS, invite });
    return invite;
  } catch (error) {
    dispatch({ type: CREATE_CHAT_INVITE_ERROR, error });
    return null;
  }
};

export let getChatById = id => async dispatch => {
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

export let joinChat = (id, persona) => async dispatch => {
  try {
    const body = JSON.stringify({
      persona
    });
    const res = await (await fetch(`/api/chats/${id}/join`, {
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
  } catch (error) {
    dispatch({ type: GET_CHAT_ERROR, error });
    return null;
  }
};

export let getChatUsersByChatId = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/chats/${id}/users`)).json();

    if (res.error) {
      throw res;
    }
    const { users } = res;
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  } catch (error) {
    dispatch({ type: GET_CHAT_USERS_ERROR, error });
    return null;
  }
};

export let getLinkedChatUsersByChatId = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/chats/${id}/users/linked`)).json();

    if (res.error) {
      throw res;
    }
    const { users } = res;
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  } catch (error) {
    dispatch({ type: GET_CHAT_USERS_ERROR, error });
    return null;
  }
};

export let setChatUsersByChatId = (id, unfilteredUsers) => async dispatch => {
  const seen = {
    /*
    user.id: index
     */
  };
  const users = unfilteredUsers.reduce((accum, user) => {
    // Newer user records are pushed to the end, so if we
    // encounter a user record that we've already seen, that
    // means we have a record that needs to be updated.
    const index = seen[user.id];
    if (index !== undefined) {
      accum[index] = user;
    } else {
      seen[user.id] = accum.length;
      accum.push(user);
    }
    return accum;
  }, []);

  dispatch({ type: SET_CHAT_USERS_SUCCESS, users });

  return users;
};

export let getChatMessagesByChatId = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/chats/${id}/messages`)).json();

    if (res.error) {
      throw res;
    }
    const { messages } = res;
    // NOTE: There is currently no reducer for this action.
    dispatch({ type: GET_CHAT_MESSAGES_SUCCESS, messages });
    return messages;
  } catch (error) {
    dispatch({ type: GET_CHAT_MESSAGES_ERROR, error });
    return null;
  }
};

export let getChatMessagesCountByChatId = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/chats/${id}/messages/count`)).json();

    if (res.error) {
      throw res;
    }
    const { count } = res;
    // NOTE: There is currently no reducer for this action.
    dispatch({ type: GET_CHAT_MESSAGES_COUNT_SUCCESS, count });
    return count;
  } catch (error) {
    dispatch({ type: GET_CHAT_MESSAGES_COUNT_ERROR, error });
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

export let getChatsByCohortId = (id) => async dispatch => {
  try {
    const res = await (await fetch(`/api/chats/cohort/${id}`)).json();

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

export let linkRunToChat = (id, run_id) => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/chats/link/${id}/run/${run_id}`
    )).json();

    if (res.error) {
      throw res;
    }
    const { chat } = res;
    dispatch({ type: LINK_RUN_TO_CHAT_SUCCESS, chat });
    return chat;
  } catch (error) {
    dispatch({ type: LINK_RUN_TO_CHAT_ERROR, error });
    return null;
  }
};

// export let linkUserToChat = (chat_id, role) => async dispatch => {
//   try {
//     const res = await (await fetch(
//       `/api/cohorts/${cohort_id}/join/${role}`
//     )).json();
//     if (res.error) {
//       throw res;
//     }

//     const { users, usersById } = res;
//     dispatch({ type: SET_COHORT_USER_ROLE_SUCCESS, users, usersById });
//     return {
//       users,
//       usersById
//     };
//   } catch (error) {
//     dispatch({ type: SET_COHORT_USER_ROLE_ERROR, error });
//     return null;
//   }
// };


export let setMessageById = (id, params) => async dispatch => {
  try {
    if (Object.values(params).length) {
      const body = JSON.stringify(params);
      const res = await (await fetch(`/api/chats/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })).json();

      if (res.error) {
        throw res;
      }

      const { message } = res;
      dispatch({ type: SET_CHAT_MESSAGE_SUCCESS, message });
      return message;
    }
    return null;
  } catch (error) {
    dispatch({ type: SET_CHAT_MESSAGE_ERROR, error });
    return null;
  }
};
