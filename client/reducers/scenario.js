import {
    // GET_SCENARIO,
    GET_SCENARIO_SUCCESS,
    // GET_SCENARIO_ERROR,
    // GET_SCENARIOS,
    GET_SCENARIOS_SUCCESS,
    // GET_SCENARIOS_ERROR,
    GET_SCENARIO_RUN_HISTORY_SUCCESS,
    GET_SLIDES_SUCCESS,
    SET_SCENARIO,
    // SET_SCENARIO_SUCCESS,
    // SET_SCENARIO_ERROR,
    SET_SCENARIOS,
    // SET_SCENARIOS_SUCCESS,
    // SET_SCENARIOS_ERROR,
    SET_SLIDES
} from '@client/actions/types';

const initialScenarioState = {
    title: '',
    description: '',
    consent: {
        id: null,
        prose: ''
    },
    finish: {
        components: [],
        is_finish: true,
        title: ''
    },
    slides: [],
    status: 1
};

export const scenario = (state = initialScenarioState, action) => {
    const { scenario, slides, type } = action;
    switch (type) {
        case SET_SCENARIO:
        case GET_SCENARIO_SUCCESS:
            return {
                ...state,
                ...scenario
            };
        case SET_SLIDES:
        case GET_SLIDES_SUCCESS:
            return {
                ...state,
                ...slides
            };
        default:
            return state;
    }
};

const initialHistoryState = {
    prompts: [],
    responses: []
};

export const history = (state = initialHistoryState, action) => {
    const { history, type } = action;
    switch (type) {
        case GET_SCENARIO_RUN_HISTORY_SUCCESS:
            return {
                ...state,
                ...history
            };
        default:
            return state;
    }
};

export const scenarios = (state = [], action) => {
    const { scenarios, type } = action;

    switch (type) {
        case SET_SCENARIOS:
        case GET_SCENARIOS_SUCCESS:
            return scenarios;
        default:
            return state;
    }
};
