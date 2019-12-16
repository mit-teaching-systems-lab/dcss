import { combineReducers } from 'redux';

import {
    CREATE_COHORT_SUCCESS,
    SET_COHORT,

    //
    //
    //
    // TODO
    //
    //
    //
    // SET_COHORT_ERROR,
    // SET_COHORT_SUCCESS,
    // GET_COHORT,
    // GET_COHORT_ERROR,
    // TODO: These will be used in a follow up changeset
    GET_COHORT_DATA_SUCCESS,
    GET_COHORT_PARTICIPANTS_SUCCESS,
    GET_COHORT_SUCCESS,
    // GET_USER_COHORTS,
    GET_RUN_DATA_SUCCESS,
    GET_USER_COHORTS_SUCCESS,
    SET_COHORT_USER_ROLE_SUCCESS
    // GET_USER_COHORTS_ERROR
} from '../actions/types';

const cohortInitialState = {
    id: null,
    created_at: '',
    name: '',
    role: '',
    runs: [],
    scenarios: [],
    users: []
};

const currentCohort = (state = cohortInitialState, action) => {
    const { type, cohort } = action;

    if (type === SET_COHORT || type === GET_COHORT_SUCCESS) {
        return {
            ...state,
            ...cohort
        };
    }

    if (type === CREATE_COHORT_SUCCESS) {
        return {
            ...state,
            ...cohort,
            role: 'owner'
        };
    }

    return state;
};

const userCohorts = (state = [], action) => {
    const { type, cohorts } = action;
    if (type === GET_USER_COHORTS_SUCCESS) {
        return cohorts.slice();
    }

    return state;
};

const getCohorts = (state = [], action) => {
    const { type, cohorts } = action;
    if (type === GET_USER_COHORTS_SUCCESS) {
        return cohorts.slice();
    }

    return state;
};

const getCohort = (state = cohortInitialState, action) => {
    const { type, cohort } = action;

    switch (type) {
        case SET_COHORT:
        case GET_COHORT_SUCCESS:
            return {
                ...state,
                ...cohort
            };
        case GET_COHORT_PARTICIPANTS_SUCCESS:
            return {
                ...state,
                users: cohort.users
            };
        default:
            return state;
    }
};

const dataInitialState = {
    prompts: [],
    responses: []
};

const getCohortData = (state = dataInitialState, action) => {
    const { type, prompts, responses } = action;

    switch (type) {
        case GET_COHORT_DATA_SUCCESS:
        case GET_RUN_DATA_SUCCESS:
            return {
                ...state,
                prompts,
                responses
            };
        default:
            return state;
    }
};

const setCohortUserRole = (state = cohortInitialState, action) => {
    const { type, users } = action;
    if (type === SET_COHORT_USER_ROLE_SUCCESS) {
        return {
            ...state,
            users
        };
    }

    return state;
};

export default combineReducers({
    currentCohort,
    userCohorts,
    getCohorts,
    getCohort,
    getCohortData,
    setCohortUserRole
});
