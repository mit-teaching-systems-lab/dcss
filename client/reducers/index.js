import { combineReducers } from 'redux';

import { cohort, cohorts, cohortsById } from './cohort';
import errors from './errors';
import { history } from './history';
import login from './login';
import { logs, logsById } from './logs';
import { response, responses, responsesById } from './response';
import { run, runs, runsById } from './run';
import { scenario } from './scenario';
import { scenarios, scenariosById } from './scenarios';
import tags from './tags';
import { user } from './user';
import { users, usersById } from './users';

export default combineReducers({
  cohort,
  cohorts,
  cohortsById,
  errors,
  history,
  login,
  logs,
  logsById,
  response,
  responses,
  responsesById,
  run,
  runs,
  runsById,
  scenario,
  scenarios,
  scenariosById,
  tags,
  user,
  users,
  usersById
});
