import { SET_RUN } from '@client/actions/types';

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_RUN:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
