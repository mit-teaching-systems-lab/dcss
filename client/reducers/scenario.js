import { SET_SCENARIO } from '@client/actions/types';

const initialState = {
    title: '',
    description: ''
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SCENARIO:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
