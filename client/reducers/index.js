import { combineReducers } from 'redux';

import admin from './admin';
import cohort from './cohort';
import login from './login';
import { user } from './user';
import { response, responses, responsesById } from './response';
import { run, runs } from './run';
import { history, scenario, scenarios } from './scenario';

export default combineReducers({
  admin,
  cohort,
  history,
  login,
  response,
  responses,
  responsesById,
  run,
  runs,
  scenario,
  scenarios,
  user
});
