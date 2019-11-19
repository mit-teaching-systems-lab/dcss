import { combineReducers } from 'redux';

import admin from './admin';
import cohort from './cohort';
import login from './login';
import scenario from './scenario';

export default combineReducers({ login, scenario, admin, cohort });
