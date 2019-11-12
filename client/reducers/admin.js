import { SET_USERS } from '@client/actions/types';

const initialState = {
    users: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_USERS:
            return {
                ...state,
                users: action.payload.users
            };
        default:
            return state;
    }
}
