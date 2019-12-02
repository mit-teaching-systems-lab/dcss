import { SET_SCENARIO, SET_SLIDES, SET_SCENARIOS } from '@client/actions/types';

const initialState = {
    title: '',
    description: '',
    consent: {
        id: null,
        prose: ''
    },
    slides: [],
    status: 1
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SCENARIO:
        case SET_SCENARIOS: {
            return {
                ...state,
                ...action.payload
            };
        }
        case SET_SLIDES:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
