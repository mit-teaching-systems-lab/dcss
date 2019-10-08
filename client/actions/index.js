import { LOG_IN, LOG_OUT, SET_SCENARIO } from './types';

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
