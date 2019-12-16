import { combineReducers } from 'redux';

import admin from './admin';
import cohort from './cohort';
import login from './login';
import { user } from './user';
import { response, responses } from './response';
import { run, runs } from './run';
import { scenario, scenarios } from './scenario';

export default combineReducers({
    admin,
    cohort,
    login,
    response,
    responses,
    run,
    runs,
    scenario,
    scenarios,
    user
});
