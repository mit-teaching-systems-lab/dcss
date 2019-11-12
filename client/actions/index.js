import { LOG_IN, LOG_OUT, SET_SCENARIO, SET_SLIDES, SET_USERS } from './types';

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

export const setScenario = scenarioData => ({
    type: SET_SCENARIO,
    payload: scenarioData
});

export const setSlides = slidesData => ({
    type: SET_SLIDES,
    payload: slidesData
});

export const setUsers = userData => ({
    type: SET_USERS,
    payload: userData
});
