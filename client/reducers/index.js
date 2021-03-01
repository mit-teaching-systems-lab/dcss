import { combineReducers } from 'redux';

import { agent, agents, agentsById } from './agent';
import { chat, chats, chatsById } from './chat';
import { cohort, cohorts, cohortsById } from './cohort';
import errors from './errors';
import filters from './filters';
import { history } from './history';
import { interactions, interactionsById } from './interaction';
import { invites, invitesById } from './invite';
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
  interactions,
  interactionsById,
  invites,
  invitesById,
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
