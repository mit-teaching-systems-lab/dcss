import { LOG_IN, LOG_OUT } from '@client/actions/types';
import Session from '@client/util/session';

const { username = '', permissions = [] } = Session.isSessionActive()
    ? Session.getSession()
    : {};
const initialState = {
    isLoggedIn: !!username,
    username,
    permissions
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LOG_IN: {
            const { isLoggedIn, username, permissions } = action.payload;

            return {
                ...state,
                username,
                permissions,
                isLoggedIn
            };
        }
        case LOG_OUT: {
            let { username, isLoggedIn } = action.payload;

            return {
                ...state,
                username,
                permissions,
                isLoggedIn
            };
        }
        default:
            return state;
    }
}
