import {
    GET_RESPONSE,
    GET_RESPONSE_SUCCESS,
    GET_RESPONSE_ERROR,
    SET_RESPONSES,
    SET_RESPONSES_SUCCESS,
    SET_RESPONSES_ERROR
} from './types';

export const getResponse = ({ id, responseId }) => async dispatch => {
    dispatch({ type: GET_RESPONSE, id });
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

export const setResponses = (id, responses) => async dispatch => {
    dispatch({ type: SET_RESPONSES, responses });
    try {
        for (let [name, body] of responses) {
            await fetch(`/api/runs/${id}/response/${name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
        }

        dispatch({ type: SET_RESPONSES_SUCCESS, responses });
        return responses;
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: SET_RESPONSES_ERROR, status, message, stack });
    }
};
