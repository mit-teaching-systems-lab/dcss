import { combineReducers } from 'redux';

import login from './login';
import scenario from './scenario';

export default combineReducers({ login, scenario });
