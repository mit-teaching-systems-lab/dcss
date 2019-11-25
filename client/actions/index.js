import {
    LOG_IN,
    LOG_OUT,
    SET_RUN,
    SET_SCENARIO,
    SET_SCENARIOS,
    SET_SLIDES,
    SET_USERS
} from './types';

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

export const setScenario = payload => ({
    type: SET_SCENARIO,
    payload
});

export const setScenarios = payload => ({
    type: SET_SCENARIOS,
    payload
});

export const setSlides = payload => ({
    type: SET_SLIDES,
    payload
});

export const setUsers = payload => ({
    type: SET_USERS,
    payload
});
