import { combineReducers } from 'redux';

import { cohort, cohorts, cohortsById } from './cohort';
import errors from './errors';
import { history } from './history';
import { session } from './session';
import { logs, logsById } from './logs';
import { persona, personas, personasById } from './persona';
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
  logs,
  logsById,
  persona,
  personas,
  personasById,
  response,
  responses,
  responsesById,
  run,
  runs,
  runsById,
  scenario,
  scenarios,
  scenariosById,
  session,
  tags,
  user,
  users,
  usersById
});
