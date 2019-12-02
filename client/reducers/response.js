import {
    GET_RESPONSE_SUCCESS,
    GET_RESPONSES_SUCCESS,
    SET_RESPONSE_SUCCESS,
    SET_RESPONSES_SUCCESS
} from '@client/actions/types';

const initialState = {
    type: '',
    value: '',
    isSkip: false
};

export const response = (state = initialState, action) => {
    const { response, type } = action;

    switch (type) {
        case GET_RESPONSE_SUCCESS:
        case SET_RESPONSE_SUCCESS:
            return {
                ...state,
                ...response
            };
        default:
            return state;
    }
};

export const responses = (state = [], action) => {
    const { responses, type } = action;

    switch (type) {
        case GET_RESPONSES_SUCCESS:
        case SET_RESPONSES_SUCCESS:
            return responses;
        default:
            return state;
    }
};
