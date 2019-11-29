import {
    // GET_SCENARIO,
    GET_SCENARIO_SUCCESS,
    // GET_SCENARIO_ERROR,
    // GET_SCENARIOS,
    GET_SCENARIOS_SUCCESS,
    // GET_SCENARIOS_ERROR,
    SET_SCENARIO,
    // SET_SCENARIO_SUCCESS,
    // SET_SCENARIO_ERROR,
    SET_SCENARIOS,
    // SET_SCENARIOS_SUCCESS,
    // SET_SCENARIOS_ERROR,
    SET_SLIDES
} from '@client/actions/types';

const initialState = {
    title: '',
    description: '',
    consent: {
        id: null,
        prose: ''
    },
    slides: [],
    status: 1
};

export const scenario = (state = initialState, action) => {
    const { scenario, slides, type } = action;

    if (type === SET_SCENARIO || type === GET_SCENARIO_SUCCESS) {
        return {
            ...state,
            ...scenario
        };
    }

    if (type === SET_SLIDES) {
        return {
            ...state,
            ...slides
        };
    }

    return state;
};

export const scenarios = (state = [], action) => {
    const { scenarios, type } = action;

    if (type === SET_SCENARIOS || type === GET_SCENARIOS_SUCCESS) {
        return scenarios;
    }

    return state;
};
