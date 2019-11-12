import { SET_SCENARIO, SET_SLIDES } from '@client/actions/types';

const initialState = {
    title: '',
    description: '',
    slides: null,
    status: 1
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SCENARIO:
        case SET_SLIDES:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
