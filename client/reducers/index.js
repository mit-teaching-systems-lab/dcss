import { combineReducers } from 'redux';

import login from './login';
import scenario from './scenario';
import admin from './admin';

export default combineReducers({ login, scenario, admin });
