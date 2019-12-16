import {
    GET_RUN_SUCCESS,
    GET_RUNS_SUCCESS,
    SET_RUN_SUCCESS
} from '@client/actions/types';

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

export const runs = (state = [], action) => {
    const { runs, type } = action;

    switch (type) {
        case GET_RUNS_SUCCESS:
            return runs;
        default:
            return state;
    }
};
