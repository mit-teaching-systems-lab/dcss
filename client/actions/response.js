import Storage from '@utils/Storage';
import {
  GET_RESPONSE_SUCCESS,
  GET_RESPONSE_ERROR,
  GET_TRANSCRIPT_SUCCESS,
  GET_TRANSCRIPT_ERROR,
  SET_RESPONSES_SUCCESS,
  SET_RESPONSES_ERROR
} from './types';

export const getResponse = ({ id, responseId }) => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/runs/${id}/response/${responseId}`
    )).json();

    if (res.error) {
      throw res;
    }

    const { response } = res;
    dispatch({ type: GET_RESPONSE_SUCCESS, response });
    return response;
  } catch (error) {
    dispatch({ type: GET_RESPONSE_ERROR, error });
    return null;
  }
};

export const getTranscriptOnly = ({ id, responseId }) => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/runs/${id}/response/${responseId}/transcript`
    )).json();

    if (res.error) {
      throw res;
    }
    const { transcript } = res;
    dispatch({ type: GET_TRANSCRIPT_SUCCESS, transcript });
    return transcript;
  } catch (error) {
    dispatch({ type: GET_TRANSCRIPT_ERROR, error });
    return null;
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
    dispatch({ type: SET_RESPONSES_ERROR, error });
    return null;
  }
};
