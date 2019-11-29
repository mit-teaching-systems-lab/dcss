import { combineReducers } from 'redux';

import admin from './admin';
import cohort from './cohort';
import login from './login';
import run from './run';
import { scenario, scenarios } from './scenario';

export default combineReducers({
    admin,
    cohort,
    login,
    run,
    scenario,
    scenarios
});
