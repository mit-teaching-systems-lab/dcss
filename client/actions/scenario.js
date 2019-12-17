import {
    GET_SCENARIO,
    GET_SCENARIO_SUCCESS,
    GET_SCENARIO_ERROR,
    GET_SCENARIOS,
    GET_SCENARIOS_SUCCESS,
    GET_SCENARIOS_ERROR,
    GET_SCENARIO_RUN_HISTORY,
    GET_SCENARIO_RUN_HISTORY_SUCCESS,
    GET_SCENARIO_RUN_HISTORY_ERROR,
    GET_SLIDES,
    GET_SLIDES_SUCCESS,
    GET_SLIDES_ERROR,
    SET_SCENARIO,
    // SET_SCENARIO_SUCCESS,
    // SET_SCENARIO_ERROR,
    SET_SCENARIOS,
    // SET_SCENARIOS_SUCCESS,
    // SET_SCENARIOS_ERROR,
    SET_SLIDES
} from './types';

export const getScenarios = () => async dispatch => {
    dispatch({ type: GET_SCENARIOS });
    try {
        const { scenarios, error } = await (await fetch(
            '/api/scenarios'
        )).json();
        if (error) {
            throw error;
        }

        dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
        return scenarios;
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: GET_SCENARIOS_ERROR, status, message, stack });
    }
};

export const getScenario = id => async dispatch => {
    dispatch({ type: GET_SCENARIO, id });
    try {
        const { scenario, error } = await (await fetch(
            `/api/scenarios/${id}`
        )).json();

        if (error) {
            throw error;
        }
        dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
        return scenario;
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: GET_SCENARIO_ERROR, status, message, stack });
    }
};

export const getScenarioRunHistory = params => async dispatch => {
    const { scenarioId, cohortId } = params;
    dispatch({ type: GET_SCENARIO_RUN_HISTORY });
    try {
        const endpoint = cohortId
            ? `/api/scenarios/${scenarioId}/cohort/${cohortId}/history`
            : `/api/scenarios/${scenarioId}/history`;

        const { history, error } = await (await fetch(endpoint)).json();

        if (error) {
            throw error;
        }

        dispatch({ type: GET_SCENARIO_RUN_HISTORY_SUCCESS, ...history });
        return { ...history };
    } catch (error) {
        const { message, stack, status } = error;
        dispatch({
            type: GET_SCENARIO_RUN_HISTORY_ERROR,
            message,
            stack,
            status
        });
        // pass along the error to the promise action
        throw error;
    }
};

export const getSlides = scenarioId => async dispatch => {
    dispatch({ type: GET_SLIDES, scenarioId });
    try {
        const { slides, error } = await (await fetch(
            `/api/scenarios/${scenarioId}/slides`
        )).json();

        if (error) {
            throw error;
        }
        dispatch({ type: GET_SLIDES_SUCCESS, slides });
        return slides;
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: GET_SLIDES_ERROR, status, message, stack });
    }
};

export const setScenario = scenario => ({
    type: SET_SCENARIO,
    scenario
});

export const setScenarios = scenarios => ({
    type: SET_SCENARIOS,
    scenarios
});

export const setSlides = slides => ({
    type: SET_SLIDES,
    slides
});
