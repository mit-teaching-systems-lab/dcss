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
    GET_COHORT_SUCCESS,
    // GET_USER_COHORTS,
    GET_USER_COHORTS_SUCCESS,
    SET_COHORT_USER_ROLE_SUCCESS
    // GET_USER_COHORTS_ERROR
} from '../actions/types';

const initialState = {
    id: null,
    created_at: '',
    name: '',
    role: '',
    runs: [],
    scenarios: [],
    users: []
};

const currentCohort = (state = initialState, action) => {
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

const getCohort = (state = initialState, action) => {
    const { type, cohort } = action;
    if (type === SET_COHORT || type === GET_COHORT_SUCCESS) {
        return {
            ...state,
            ...cohort
        };
    }

    return state;
};

const setCohortUserRole = (state = initialState, action) => {
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
    setCohortUserRole
});
