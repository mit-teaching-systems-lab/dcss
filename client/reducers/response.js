import {
  GET_RESPONSE_SUCCESS,
  GET_RESPONSES_SUCCESS,
  SET_RESPONSE_SUCCESS,
  SET_RESPONSES_SUCCESS
} from '@client/actions/types';

const initialState = {};

export const response = (state = initialState, action) => {
  const { response = {}, type } = action;
  const data = {
    ...response,
    ...(response.response || {})
  };

  switch (type) {
    case GET_RESPONSE_SUCCESS:
    case SET_RESPONSE_SUCCESS:
      return {
        ...state,
        ...data
      };
    default:
      return state;
  }
};

export const responses = (state = [], action) => {
  const { response = {}, responses = [], type } = action;

  switch (type) {
    case GET_RESPONSE_SUCCESS:
    case SET_RESPONSE_SUCCESS:
    case GET_RESPONSES_SUCCESS:
    case SET_RESPONSES_SUCCESS:
      return [...state, ...responses, ...[response]];
    default:
      return state;
  }
};

export const responsesById = (state = {}, action) => {
  const { response, responses, responsesById, type } = action;
  let data = {};

  if (responsesById) {
    data = {
      ...data,
      ...responsesById
    };
  }

  if (responses) {
    const responsesByIdFromArray = responses.reduce((accum, response) => {
      accum[response.response_id] = {
        ...response,
        ...response.response
      };
      return accum;
    }, {});

    data = {
      ...data,
      ...responsesByIdFromArray
    };
  }

  if (response) {
    data = {
      ...data,
      [response.response_id]: {
        ...response,
        ...response.response
      }
    };
  }

  switch (type) {
    case GET_RESPONSE_SUCCESS:
    case SET_RESPONSE_SUCCESS:
    case GET_RESPONSES_SUCCESS:
    case SET_RESPONSES_SUCCESS:
      return {
        ...state,
        ...data
      };
    default:
      return state;
  }
};
