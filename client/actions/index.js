import { LOG_IN, LOG_OUT } from './types';

export const logIn = username => ({
    type: LOG_IN,
    payload: {
        username,
        isLoggedIn: true
    }
});

export const logOut = username => ({
    type: LOG_OUT,
    payload: {
        username,
        isLoggedIn: false
    }
});
