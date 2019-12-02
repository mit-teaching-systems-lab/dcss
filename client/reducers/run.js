import { GET_RUN_SUCCESS, SET_RUN_SUCCESS } from '@client/actions/types';

const initialState = {};

export const run = (state = initialState, action) => {
    const { run, type } = action;

    switch (type) {
        case GET_RUN_SUCCESS:
        case SET_RUN_SUCCESS:
            return {
                ...state,
                ...run
            };
        default:
            return state;
    }
};
