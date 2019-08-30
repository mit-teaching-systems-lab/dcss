import { LOG_IN, LOG_OUT } from '@client/actions/types';

const initialState = {
    isLoggedIn: false
};

export default async function(state = initialState, action) {
    switch (action.type) {
        case LOG_IN: {
            // In the future, we can get the username from the action payload
            const { isLoggedIn } = action.payload;
            const loginData = await (await fetch(
                'http://localhost:5000/login',
                {
                    method: 'POST'
                }
            )).json();
            const username = loginData.username;

            return {
                ...state,
                username,
                isLoggedIn
            };
        }
        case LOG_OUT: {
            let { username, isLoggedIn } = action.payload;
            const logoutResponse = await fetch('http://localhost:5000/logout', {
                method: 'POST'
            });
            if (logoutResponse.ok) {
                username = '';
            }

            return {
                ...state,
                username,
                isLoggedIn
            };
        }
        default:
            return state;
    }
}
