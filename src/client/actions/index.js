import { LOG_IN, LOG_OUT } from './types';

export const logIn = username => ({
    type: LOG_IN,
    payload: {
        username,
        loggedIn: true
    }
});

export const logOut = username => ({
    type: LOG_OUT,
    payload: {
        username,
        loggedIn: false
    }
});
