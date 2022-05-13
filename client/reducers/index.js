import { agent, agents, agentsById } from './agent';
import { chat, chats, chatsById } from './chat';
import { cohort, cohorts, cohortsById, recentCohorts } from './cohort';
import {
  interaction,
  interactions,
  interactionsById,
  interactionsTypes
} from './interaction';
import { invites, invitesById } from './invite';
import { logs, logsById } from './logs';
import { partnering, partneringById } from './partnering';
import { persona, personas, personasById } from './persona';
import { recentScenarios, scenarios, scenariosById } from './scenarios';
import { response, responses, responsesById } from './response';
import { run, runs, runsById } from './run';
import { users, usersById } from './users';

import { combineReducers } from 'redux';
import errors from './errors';
import filters from './filters';
import { history } from './history';
import { scenario } from './scenario';
import { session } from './session';
import tags from './tags';
import { user } from './user';

export default combineReducers({
  agent,
  agents,
  agentsById,
  chat,
  chats,
  chatsById,
  cohort,
  cohorts,
  cohortsById,
  errors,
  filters,
  history,
  interaction,
  interactions,
  interactionsById,
  interactionsTypes,
  invites,
  invitesById,
  logs,
  logsById,
  partnering,
  partneringById,
  persona,
  personas,
  personasById,
  recentCohorts,
  response,
  responses,
  responsesById,
  run,
  runs,
  runsById,
  scenario,
  scenarios,
  scenariosById,
  recentScenarios,
  session,
  tags,
  user,
  users,
  usersById
});
