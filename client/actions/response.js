import Storage from '@utils/Storage';
import {
  // GET_RESPONSE,
  GET_RESPONSE_SUCCESS,
  GET_RESPONSE_ERROR,
  // SET_RESPONSES,
  SET_RESPONSES_SUCCESS,
  SET_RESPONSES_ERROR
} from './types';

export const getResponse = ({ id, responseId }) => async dispatch => {
  try {
    const { response, error } = await (await fetch(
      `/api/runs/${id}/response/${responseId}`
    )).json();

    if (error) {
      throw error;
    }
    dispatch({ type: GET_RESPONSE_SUCCESS, response });
    return response;
  } catch (error) {
    const { message, status, stack } = error;
    dispatch({ type: GET_RESPONSE_ERROR, status, message, stack });
  }
};

export const setResponses = (id, submitted) => async dispatch => {
  const responses = [];
  const responsesById = {};
  try {
    for (let [responseId, body] of submitted) {
      responses.push(body);
      responsesById[responseId] = body;

      await fetch(`/api/runs/${id}/response/${responseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (Storage.has(`run/${id}/${responseId}`)) {
        Storage.delete(`run/${id}/${responseId}`);
      }
    }
    dispatch({ type: SET_RESPONSES_SUCCESS, responses, responsesById });
    return responses;
  } catch (error) {
    const { message, status, stack } = error;
    dispatch({ type: SET_RESPONSES_ERROR, status, message, stack });
  }
};
