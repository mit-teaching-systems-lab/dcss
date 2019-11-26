import { LOG_IN, LOG_OUT, SET_RUN, SET_USERS } from './types';

export const logIn = userData => ({
    type: LOG_IN,
    payload: {
        ...userData,
        isLoggedIn: true
    }
});

export const logOut = userData => ({
    type: LOG_OUT,
    payload: {
        ...userData,
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
