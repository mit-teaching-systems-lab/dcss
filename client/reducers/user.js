import {
    GET_USER_SUCCESS,
    // GET_USERS_SUCCESS,
    SET_USER_SUCCESS
    // SET_USERS_SUCCESS
} from '@client/actions/types';

const initialState = {};

export const user = (state = initialState, action) => {
    const { user, type } = action;

    switch (type) {
        case GET_USER_SUCCESS:
        case SET_USER_SUCCESS:
            return {
                ...state,
                ...user
            };
        default:
            return state;
    }
};
