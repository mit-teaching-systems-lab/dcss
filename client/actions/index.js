import { LOG_IN, LOG_OUT, SET_RUN, SET_USERS } from './types';

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

export const setRun = payload => ({
    type: SET_RUN,
    payload
});

export const setUsers = payload => ({
    type: SET_USERS,
    payload
});
