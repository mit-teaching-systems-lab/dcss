import { combineReducers } from 'redux';

import cohort from './cohort';
import login from './login';
import { response, responses, responsesById } from './response';
import { run, runs } from './run';
import { history, scenario } from './scenario';
import { scenarios } from './scenarios';
import { user } from './user';
import { users } from './users';

export default combineReducers({
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
  user,
  users
});
